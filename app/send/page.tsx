"use client";
import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, erc20Abi } from "viem";
import routerAbi from "@/lib/abis/PaymentRouter.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { TOKENS } from "@/lib/tokenlist";
import { useSearchParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCopy, 
  faQrcode, 
  faUsers, 
  faCheck, 
  faTimes, 
  faBolt, 
  faCoins, 
  faLightbulb, 
  faComment, 
  faCircle 
} from "@fortawesome/free-solid-svg-icons";

function TokenSelector({ 
  token, 
  setToken, 
  tokenAddress, 
  setTokenAddress 
}: { 
  token: "ETH" | "ERC20"; 
  setToken: (token: "ETH" | "ERC20") => void;
  tokenAddress: string;
  setTokenAddress: (address: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Token Type</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setToken("ETH")}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              token === "ETH" 
                ? "border-indigo-500 bg-indigo-500/20 text-white" 
                : "border-white/20 bg-white/5 text-white/60 hover:border-white/30"
            }`}
          >
            <div className="text-2xl mb-2">
              <FontAwesomeIcon icon={faBolt} />
            </div>
            <div className="font-semibold">ETH</div>
            <div className="text-xs opacity-70">Native Token</div>
          </button>
          <button
            onClick={() => setToken("ERC20")}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              token === "ERC20" 
                ? "border-cyan-500 bg-cyan-500/20 text-white" 
                : "border-white/20 bg-white/5 text-white/60 hover:border-white/30"
            }`}
          >
            <div className="text-2xl mb-2">
              <FontAwesomeIcon icon={faCoins} />
            </div>
            <div className="font-semibold">ERC-20</div>
            <div className="text-xs opacity-70">Tokens</div>
          </button>
        </div>
      </div>

      {token === "ERC20" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Select Token</label>
            <select 
              className="input w-full"
              value={tokenAddress} 
              onChange={(e) => setTokenAddress(e.target.value as `0x${string}`)}
            >
              <option value="">Choose a token</option>
              {TOKENS.filter(t => t.address !== "0x0000000000000000000000000000000000000000").map((t) => (
                <option key={t.symbol} value={t.address}>
                  {t.symbol} - {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Or paste token address</label>
            <input 
              className="input w-full" 
              placeholder="0x..." 
              value={tokenAddress} 
              onChange={(e) => setTokenAddress(e.target.value)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

function AmountInput({ 
  amount, 
  setAmount, 
  token 
}: { 
  amount: string; 
  setAmount: (amount: string) => void;
  token: "ETH" | "ERC20";
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">Amount</label>
      <div className={`relative transition-all duration-300 ${focused ? 'scale-105' : ''}`}>
        <input 
          className="input w-full text-xl font-semibold pr-16" 
          placeholder="0.0" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 font-medium">
          {token}
        </div>
      </div>
      <div className="flex gap-2">
        {["0.1", "0.5", "1", "Max"].map((value) => (
          <button
            key={value}
            onClick={() => setAmount(value === "Max" ? "0" : value)}
            className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300"
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

function RecipientInput({ 
  to, 
  setTo 
}: { 
  to: string; 
  setTo: (to: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">Recipient Address</label>
      <input 
        className="input w-full font-mono" 
        placeholder="0x..." 
        value={to} 
        onChange={(e) => setTo(e.target.value)} 
      />
      <div className="flex items-center gap-2 text-xs text-white/60">
        <FontAwesomeIcon icon={faLightbulb} />
        <span>You can also scan a QR code or paste from clipboard</span>
      </div>
    </div>
  );
}

function MessageInput({ 
  message, 
  setMessage 
}: { 
  message: string; 
  setMessage: (message: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">Message (Optional)</label>
      <textarea 
        className="input w-full h-20 resize-none" 
        placeholder="Add a personal message..." 
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
        maxLength={100}
      />
      <div className="flex justify-between text-xs text-white/60">
        <span className="inline-flex items-center gap-2"><FontAwesomeIcon icon={faComment} /> Social payments with messages</span>
        <span>{message.length}/100</span>
      </div>
    </div>
  );
}

function TransactionSummary({ 
  token, 
  amount, 
  to, 
  message, 
  tokenAddress 
}: { 
  token: "ETH" | "ERC20"; 
  amount: string; 
  to: string; 
  message: string;
  tokenAddress: string;
}) {
  if (!amount || !to) return null;

  return (
    <div className="card p-6 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 animate-fadeInUp">
      <h3 className="text-lg font-semibold text-white mb-4">Transaction Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-white/70">Amount:</span>
          <span className="text-white font-semibold">{amount} {token}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">To:</span>
          <span className="text-white font-mono text-sm">{to.slice(0, 6)}...{to.slice(-4)}</span>
        </div>
        {message && (
          <div className="flex justify-between">
            <span className="text-white/70">Message:</span>
            <span className="text-white text-sm max-w-32 truncate">{message}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-white/70">Network:</span>
          <span className="text-white">Base Sepolia</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Fee:</span>
          <span className="text-white">~$0.01</span>
        </div>
      </div>
    </div>
  );
}

export default function SendPage() {
  const { address } = useAccount();
  const params = useSearchParams();
  const router = useRouter();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<"ETH" | "ERC20">("ETH");
  const [tokenAddress, setTokenAddress] = useState(CONTRACT_ADDRESSES.miniToken);

  useEffect(() => {
    const qpTo = params.get("to");
    const qpAmount = params.get("amount");
    const qpMessage = params.get("message");
    const qpToken = params.get("token");
    if (qpTo) setTo(qpTo);
    if (qpAmount) setAmount(qpAmount);
    if (qpMessage) setMessage(qpMessage);
    if (qpToken === "ETH" || qpToken === "ERC20") setToken(qpToken);
    const qpTokenAddress = params.get("tokenAddress");
    if (qpTokenAddress) setTokenAddress(qpTokenAddress as `0x${string}`);
  }, [params]);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: allowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, CONTRACT_ADDRESSES.paymentRouter as `0x${string}`],
    query: { enabled: token === "ERC20" && !!address && !!tokenAddress },
  });

  const needsApprove = token === "ERC20" && allowance !== undefined && BigInt(allowance as any) < BigInt(Math.floor(Number(amount || "0") * Math.pow(10, 18)));

  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { isLoading: isApproveMining, isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

  function onSend() {
    if (token === "ETH") {
      writeContract({
        address: CONTRACT_ADDRESSES.paymentRouter as `0x${string}`,
        abi: routerAbi as any,
        functionName: "payETH",
        args: [to as `0x${string}`, message],
        value: parseEther(amount),
      });
    } else {
      if (needsApprove) {
        writeApprove({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [CONTRACT_ADDRESSES.paymentRouter as `0x${string}`, BigInt(Math.floor(Number(amount) * Math.pow(10, 18)))],
        });
        return;
      }
      writeContract({
        address: CONTRACT_ADDRESSES.paymentRouter as `0x${string}`,
        abi: routerAbi as any,
        functionName: "payERC20",
        args: [tokenAddress as `0x${string}`, to as `0x${string}`, BigInt(Math.floor(Number(amount) * Math.pow(10, 18))), message],
      });
    }
  }

  const isDisabled = isPending || isMining || isApproveMining || !amount || !to || !address;

  return (
    <div className="responsive-container py-6 sm:py-8 max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeInLeft">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-gradient">Send Money</span>
        </h1>
        <p className="text-white/70">Transfer funds instantly with social messages</p>
      </div>

      <div className="responsive-grid-2 gap-8">
        {/* Send Form */}
        <div className="space-y-6">
          <div className="card p-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-semibold text-white mb-6">Payment Details</h2>
            <div className="space-y-6">
              <TokenSelector 
                token={token} 
                setToken={setToken}
                tokenAddress={tokenAddress}
                setTokenAddress={setTokenAddress}
              />
              <AmountInput amount={amount} setAmount={setAmount} token={token} />
              <RecipientInput to={to} setTo={setTo} />
              <MessageInput message={message} setMessage={setMessage} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={onSend} 
              disabled={isDisabled}
              className={`btn w-full py-4 text-lg font-semibold transition-all duration-300 ${
                isDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 hover:shadow-lg'
              }`}
            >
              {token === "ERC20" && needsApprove ? (
                isApproveMining ? "Approving..." : "Approve Token"
              ) : (
                isMining ? "Sending..." : "Send Payment"
              )}
            </button>

            {hash && (
              <div className="card p-4 bg-green-500/10 border border-green-500/20 animate-fadeInUp">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <div>
                    <div className="text-white font-medium">Transaction Submitted</div>
                    <div className="text-white/60 text-sm font-mono break-all">{hash}</div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="card p-4 bg-red-500/10 border border-red-500/20 animate-fadeInUp">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                  <div>
                    <div className="text-white font-medium">Transaction Failed</div>
                    <div className="text-white/60 text-sm">{error.message}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="space-y-6">
          <TransactionSummary 
            token={token}
            amount={amount}
            to={to}
            message={message}
            tokenAddress={tokenAddress}
          />

          {/* Quick Actions */}
          <div className="card p-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/qr')}
                className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faQrcode} className="text-xl text-white/70" />
                  <div>
                    <div className="text-white font-medium">Scan QR Code</div>
                    <div className="text-white/60 text-sm">Use camera to scan payment QR</div>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (text && text.startsWith('0x') && text.length === 42) {
                      setTo(text);
                    } else {
                      alert('Invalid address in clipboard');
                    }
                  } catch (err) {
                    alert('Failed to read clipboard');
                  }
                }}
                className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faCopy} className="text-xl text-white/70" />
                  <div>
                    <div className="text-white font-medium">Paste from Clipboard</div>
                    <div className="text-white/60 text-sm">Paste address from clipboard</div>
                  </div>
                </div>
              </button>
              
              <div className="space-y-2">
                <div className="text-white font-medium text-sm">Recent Contacts</div>
                {[
                  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
                  "0x8ba1f109551bD432803012645Hac136c",
                  "0x1234567890123456789012345678901234567890"
                ].map((contact, index) => (
                  <button 
                    key={index}
                    onClick={() => setTo(contact)}
                    className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faUsers} className="text-sm text-white/70" />
                      <div>
                        <div className="text-white text-sm font-medium">
                          {contact.slice(0, 6)}...{contact.slice(-4)}
                        </div>
                        <div className="text-white/60 text-xs">Recent recipient</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card p-6 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <h3 className="text-lg font-semibold text-white mb-4">Tips</h3>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2"><FontAwesomeIcon icon={faCircle} className="text-[6px]" /> Double-check the recipient address</div>
              <div className="flex items-center gap-2"><FontAwesomeIcon icon={faCircle} className="text-[6px]" /> Add a message for social payments</div>
              <div className="flex items-center gap-2"><FontAwesomeIcon icon={faCircle} className="text-[6px]" /> Keep some ETH for gas fees</div>
              <div className="flex items-center gap-2"><FontAwesomeIcon icon={faCircle} className="text-[6px]" /> Use QR codes for quick payments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}