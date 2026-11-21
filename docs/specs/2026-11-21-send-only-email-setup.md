# Send-Only Email Setup Plan

This slice documents a future rollout. The documentation change requires no live setup.

## Design & Rationale

### DR-1: Use a dedicated sending subdomain

Use a dedicated send-only subdomain such as `mail.example.com`. Put that domain in From and use the existing mailbox for `Reply-To`. Limit new DNS records to the sender and its return path. Preserve existing mail routing and DMARC policies.

### DR-2: Verify sending and replies end to end

The provider shows the new domain as verified. One authorized message reaches a controlled external inbox, and a reply reaches the existing mailbox. The receiving server's own `Authentication-Results` records `dkim=pass` with the signing domain equal to the visible From domain and `dmarc=pass` for that From domain. Keep real addresses, record values, headers, and test results in private change notes. [Authentication-Results trust boundary](https://www.rfc-editor.org/rfc/rfc8601.html#section-1.2)

### DR-3: Keep rollback within the new setup

If setup or verification fails, pause the new sender and restore only the affected records from the saved DNS baseline. Recheck existing routing and delivery. Retire any previous sending setup in a separate change after verifying the new path and accounting for old callers.

## Decomposition

### Commit plan

- `docs(security): plan send-only email setup` adds this plan on top of the email maintenance checklist.
- The later provider setup and DNS edits are live operations. Commit application wiring separately when a real sender needs it.

### Task 001: Verify the sending subdomain

**Implements:** DR-1, DR-3

**Risk Tier:** high

Check the provider's domain allowance and confirm the sending and return-path names are available. Privately snapshot the DNS names this change will touch, plus existing MX, DKIM, DMARC, and forwarding rules. Register with receiving disabled. Add the provider's signing records under the sending domain and keep bounce records on a separate return-path host. Check all authoritative nameservers and a public resolver. Confirm the new From domain's effective DMARC policy and compare existing DNS and forwarding with the baseline. If any change fails, apply the rollback in DR-3 before retrying. [DMARC policy discovery](https://www.rfc-editor.org/rfc/rfc9989.html#section-4.10.1)

### Task 002: Verify a real message and reply

**Implements:** DR-2

**Risk Tier:** high

After Task 001 passes, send one authorized test. Check receipt, the configured `Reply-To`, the authentication results, and the reply's arrival. Check that the receiving server's trusted `smtp.mailfrom` result or delivered `Return-Path` uses the configured bounce domain. Verify existing legacy forwarding with post-change delivery evidence or a separately authorized test. Keep production sending on hold until these checks pass. If they fail, apply the rollback in DR-3. [DMARC alignment](https://www.rfc-editor.org/rfc/rfc9989.html#section-4.4)

### Task 003: Decide whether to retire the previous setup

**Implements:** DR-3

**Risk Tier:** medium

After Task 002 passes, confirm that no application still uses the previous sender. Record any decision to retire it as a separate authorized operation.
