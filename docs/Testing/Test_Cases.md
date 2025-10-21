# Test Cases

> Summary: Representative test cases mapped to PRD stories.

| ID | Story | Case | Steps | Expected |
|---|---|---|---|---|
| TC-001 | Send payment | ETH send | Call `payETH(to,"hi")` with value | `PaymentSent` event, recipient balance increases |
| TC-002 | Send payment | ERC-20 send | Approve then `payERC20(token,to,amt,"hi")` | `PaymentSent` event, balances move |
| TC-003 | Savings circle | Create/deposit/payout | Create, all members deposit, then `payout` | Recipient receives pot; round advances |
| TC-004 | Reputation | Endorse | `endorse(target)` | Endorsements increments, score increases |
| TC-005 | Emergency | Toggle global | `setGlobalEmergency(true)` | Emergency state true |
