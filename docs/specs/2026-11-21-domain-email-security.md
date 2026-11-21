# Email Configuration Maintenance

Use this checklist when changing email authentication for a site domain. Keep operational evidence in private change notes.

## Prepare the change

- Record the existing DNS, routing, and website behavior.
- Identify legitimate sending services and the addresses that need to keep receiving mail.
- Limit each change to the planned records. Keep web hosting and mail routing outside authentication-only changes.

## Verify each stage

- Check the published DNS values through the authoritative servers and a public resolver.
- Check that expected mail delivery and web redirects still work.
- Review authentication results at the receiving provider before tightening a DMARC policy.
- Before using a reject policy, verify aligned DKIM for legitimate senders and evaluate indirect delivery such as mailing lists.
- Evaluate subdomains within their own policy scope.

If a verification check fails, pause the rollout and restore the last working policy. Verify DNS and repeat the affected delivery checks after rollback.

References: [SPF](https://www.rfc-editor.org/rfc/rfc7208.html) and [DMARC](https://www.rfc-editor.org/rfc/rfc9989.html).
