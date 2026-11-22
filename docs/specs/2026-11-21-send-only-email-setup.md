# Send-Only Email Setup

The rollout finished on November 21, 2026.

- Set up a dedicated subdomain for outbound mail. Future integrations use the existing mailbox in `Reply-To`.
- Added a DKIM signing record and DNS aliases for bounced mail. Existing inbound mail and DMARC policies stayed in place.
- Verified the new DNS records, sender authentication, delivery, replies, and legacy forwarding. The private change record holds the configuration and test evidence.
- If rollback is needed, pause the new sender. Remove only the new DNS records listed in the private change record. Recheck existing mail delivery.
- Application integration and retirement of the legacy sender are separate changes.
