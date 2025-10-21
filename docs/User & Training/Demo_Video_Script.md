## Sasula Gateway — 4–5 Minute Story-Driven Demo Script

- **Runtime**: ~4:30–5:00
- **Audience**: Prospective users, community leaders, NGOs, developer partners
- **Context**: Runs on Base L2; demo recorded against Base Sepolia testnet

### 0:00–0:20 — Cold open: the problem
- **Visuals**: Busy market street; money changes hands; phone screens show “Transfer pending… fees 6%…”. Cut between paper notebooks tracking savings, and someone waiting at a counter.
- **VO**: “When money needs to move now, old systems slow us down. Remittances take days. Fees eat into essentials. Community savings are manual, opaque, and fragile. And without formal credit histories, small loans are out of reach.”

### 0:20–0:50 — Introduce Sasula
- **Visuals**: Clean UI hero; “Sasula Gateway” lockup; Base logo; quick flashes of Payments, Savings, Reputation; reassuring color palette.
- **On‑screen copy**: “Near‑instant P2P payments. Transparent savings circles. On‑chain reputation. Emergency fee waivers.”
- **VO**: “Sasula Gateway brings community finance on‑chain. Fast, low‑fee payments on Base L2. Transparent rotating savings circles. Simple reputation to unlock micro‑loans. And during crises, app fees can be waived so help reaches people faster.”

### 0:50–1:15 — Meet the user
- **Visuals**: Persona title card: “Amina — shop owner; supports family across borders.”
- **VO**: “Meet Amina. She runs a small shop, sends money to family, and relies on her local savings circle. Today, she’ll do all of that in one place—with Sasula.”

### 1:15–2:00 — Journey 1: Send a payment with context
- **Visuals**: App home → `Connect Wallet` (RainbowKit) → connected state → navigate to `Send`.
- **Steps**:
  - Choose ETH (token toggle also reveals supported tokens list).
  - Paste recipient address.
  - Enter amount.
  - Add a note: “School fees — September”.
  - Confirm in wallet; success toast; payment detail with on‑chain event appears.
- **On‑screen copy**: “Confirmation <10s on L2. Typical fees ~pennies (demo on Base Sepolia).”
- **VO**: “Amina connects her wallet and sends ETH. She adds context with a note—so her sister knows what it’s for. On Base L2, confirmation is near‑instant and low cost. The transaction is recorded on‑chain with a social message event, so payment history stays transparent.”
- **Optional (5s)**: Switch to a stable token.
  - **Visuals**: Token dropdown → select USDC → send with note “Groceries”.
  - **VO**: “She can also send supported tokens the same way.”

### 2:00–2:50 — Journey 2: Transparent savings circle (ROSCA)
- **Visuals**: Navigate to `Savings`. Two tabs: `Create` and `Join`.
- **Create (organizer)**:
  - Name: “Market Circle”.
  - Deposit per round: 10 USDC.
  - Members: add addresses or share invite code.
  - Create → wallet confirm → circle dashboard.
- **Join (participant)**:
  - Paste Circle ID → Join → confirmation.
- **Run a cycle**:
  - “Deposit due in 2d” badge → Amina deposits → `Deposited` event appears.
  - Payout rotates to the next member automatically when the round completes; `Payout` event logs recipient.
- **On‑screen copy**: “Deposits and payouts are event‑driven and auditable.”
- **VO**: “Savings circles often run on trust and notebooks. Here, deposits and payouts are enforced by simple, transparent rules on‑chain. Everyone sees who deposited and when. Payouts rotate on schedule—no manual chasing.”

### 2:50–3:40 — Journey 3: Reputation and micro‑loans
- **Visuals**: Navigate to `Reputation`.
  - Amina’s profile shows endorsements and activity metrics.
  - She endorses another member; their score updates.
  - Switch to `Loans` tab: “Community Pool”.
  - A contributor adds funds to the pool (confirm in wallet).
  - Amina requests a small loan; confirm; repayment plan appears (flat demo terms).
  - Later, she repays; status flips to “Repaid”.
- **On‑screen copy**: “Simple reputation signals. Demo micro‑loans with pool funding.”
- **VO**: “On‑chain activity and peer endorsements create a lightweight reputation—useful for unlocking community loans. Contributors can fund a pool. Members request small, time‑bound loans and repay with transparent terms. It’s basic by design—clear, auditable, and community‑driven.”

### 3:40–4:15 — Journey 4: Emergency mode for crisis response
- **Visuals**: Switch persona: “Local NGO Officer.” Navigate to `Emergency`.
  - Toggle region: “UG‑Kampala” → Emergency ON.
  - A global banner appears across the app: “Emergency: fees waived in this region.”
  - Revisit the Send flow to show “App fee: waived” line item (network fees may still apply).
- **VO**: “In a flood or outage, speed and cost can be life‑critical. Authorized responders can toggle emergency mode by region, waiving app fees so aid can reach people fast. When the crisis abates, they toggle it off.”

### 4:15–4:35 — Safety, transparency, and dev‑friendly
- **Visuals**: Event history screen; link out to Basescan for a tx; quick peek at settings; dev docs teaser.
- **On‑screen copy**: “Events power history. Contracts are minimal and auditable. Next.js + Wagmi frontend.”
- **VO**: “Sasula keeps on‑chain state minimal and leans on events for history, making everything trackable. The frontend uses modern wallet UX, and developers can integrate via documented contract APIs.”

### 4:35–4:50 — Close and CTA
- **Visuals**: Montage of payments, savings, reputation; app logo; Base logo.
- **On‑screen copy**: “Try the demo • Join a circle • Build with us”
- **VO**: “From sending money to saving together—and borrowing responsibly when it matters—Sasula brings community finance into the open. Try the demo, start a circle, or build with us at `https://sasula-gateway.vercel.app`.”

### Shot list and presenter notes (quick reference)
- **Hook the pain**: fees, delays, opacity, lack of credit history.
- **Always show**: wallet connect, confirmations, on‑chain event history with human‑readable notes.
- **Savings circle**: emphasize deposits per round, rotating payouts, auditable events.
- **Reputation**: endorsements + activity; quick loan request and repay with simple demo terms.
- **Emergency mode**: region toggle, persistent banner, fee‑waived indicator in Send flow.
- **Base L2 callout**: remind viewers it’s fast and low‑fee; this demo uses Base Sepolia.
