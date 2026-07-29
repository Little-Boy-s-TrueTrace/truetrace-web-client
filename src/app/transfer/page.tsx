'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { getAccountDetails, getAccountRecipients } from '@/api/accounts';
import { transferMoney } from '@/api/transactions';

import { tokenStorage } from '@/api/tokenStorage';

export default function TransferPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Form fields
  const [sourceAccount, setSourceAccount] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = tokenStorage.getItem('token');
      const userData = tokenStorage.getItem('user');
      if (!token || !userData) {
        router.replace('/login');
      } else {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setSourceAccount(parsed.accountNumber);
      }
    }
  }, [router]);

  // Fetch account details to display current balance
  const { data: account, mutate: mutateAccount } = useSWR(
    user ? `account-${user.accountNumber}` : null,
    () => getAccountDetails(user.accountNumber)
  );
  const {
    data: recipients = [],
    error: recipientsError,
    isLoading: recipientsLoading,
  } = useSWR(user ? 'account-recipients' : null, getAccountRecipients);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const targetTrimmed = targetAccount.trim();
    const sourceTrimmed = sourceAccount.trim();

    // 1. Account format validation
    const accRegex = /^ACC-\d{6}$/;
    if (!accRegex.test(targetTrimmed)) {
      setError('Recipient account number must use the ACC-XXXXXX format.');
      setLoading(false);
      return;
    }

    if (sourceTrimmed === targetTrimmed) {
      setError('Source and recipient account numbers must be different.');
      setLoading(false);
      return;
    }

    // 2. Positive amount validation
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Transfer amount must be a valid positive number greater than zero.');
      setLoading(false);
      return;
    }

    // 3. HTML sanitization for XSS prevention
    const cleanDescription = description
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .trim();

    if (!cleanDescription) {
      setError('Description cannot be empty or contain only HTML tags.');
      setLoading(false);
      return;
    }

    try {
      const result = await transferMoney({
        sourceAccountNumber: sourceTrimmed,
        targetAccountNumber: targetTrimmed,
        amount: parsedAmount,
        description: cleanDescription,
      });

      setSuccess(`Transfer completed successfully! Reference ID: ${result.transactionId}`);
      setTargetAccount('');
      setAmount('');
      setDescription('');
      mutateAccount(); // Refresh the account balance
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || 'Transfer declined by the banking server.');
      } else {
        setError('Connection failed. Unable to reach the banking API gateway.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAF5] text-black font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar title="Asset Transfer" />

        <main className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Box: Transfer Form */}
            <div className="lg:col-span-7 glass-panel rounded-3xl p-8 border border-[#E5E7EB] bg-white shadow-sm relative space-y-6 animate-fade-in">
              
              <div>
                <h3 className="text-xl font-extrabold text-[#1B4332] tracking-wide font-heading">New Fund Transfer</h3>
                <p className="text-xs text-[#52796F] mt-1 font-medium">Submit transfer queries to internal user accounts.</p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Source Account (Transfer From) */}
                <div>
                  <label className="block text-[10px] font-bold text-[#52796F] uppercase tracking-wider mb-2">Transfer From Account</label>
                  <input
                    type="text"
                    required
                    value={sourceAccount}
                    readOnly
                    className="w-full bg-slate-100 border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-slate-600 font-mono"
                    placeholder="Source account number"
                  />
                </div>

                {/* Target account input */}
                <div>
                  <label className="block text-[10px] font-bold text-[#52796F] uppercase tracking-wider mb-2">Recipient Account</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      value={targetAccount}
                      onChange={(e) => setTargetAccount(e.target.value)}
                      list="recipient-accounts"
                      className="w-full bg-[#FAFAF5] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-black placeholder-slate-400 focus:outline-none focus:border-[#1B4332] font-mono"
                      placeholder="Choose or enter a recipient account"
                    />
                    <datalist id="recipient-accounts">
                      {recipients.map((recipient) => (
                        <option key={recipient.accountNumber} value={recipient.accountNumber}>
                          {recipient.fullName}
                        </option>
                      ))}
                    </datalist>
                    <p className="text-[10px] text-[#52796F]">
                      {recipientsLoading
                        ? 'Loading eligible recipients…'
                        : recipientsError
                          ? 'Recipient directory is unavailable; a valid account can still be entered.'
                          : `${recipients.length} eligible recipient${recipients.length === 1 ? '' : 's'} loaded from the banking API.`}
                    </p>
                  </div>
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-[10px] font-bold text-[#52796F] uppercase tracking-wider mb-2">Transfer Amount (VND)</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#FAFAF5] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-black placeholder-slate-400 focus:outline-none focus:border-[#1B4332] font-mono"
                    placeholder="Enter transfer amount"
                  />
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[11px] leading-relaxed text-amber-900">
                  <strong className="block mb-1">Prepared AML demo pattern</strong>
                  Using a funded demo account, make two separate transfers to different API-listed recipients,
                  each just below the configured structuring threshold and within the configured detection
                  window. The amount, threshold, and recipients must come from the running environment—never
                  from fixed account IDs.
                </div>

                {/* Description input */}
                <div>
                  <label className="block text-[10px] font-bold text-[#52796F] uppercase tracking-wider mb-2">Description Message</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#FAFAF5] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-black placeholder-slate-400 focus:outline-none focus:border-[#1B4332] min-h-[60px]"
                    placeholder="Enter description message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#228B22] hover:bg-[#1B7E1B] text-white font-bold py-3.5 rounded-full shadow-sm transition-all text-xs uppercase tracking-wider active:scale-[0.98] disabled:opacity-50 hover:scale-[1.01]"
                >
                  {loading ? 'Processing...' : 'Authorize Transaction'}
                </button>
              </form>

            </div>

            {/* Right Box: Source Wallet Card Display */}
            <div className="lg:col-span-5 space-y-6">
              <h4 className="text-xs font-bold text-[#52796F] uppercase tracking-wider">Debit Balance</h4>
              
              <div className="bank-card rounded-3xl p-6 min-h-[160px] flex flex-col justify-between border border-transparent shadow-xl">
                <div>
                  <span className="text-[8px] text-[#FAFAF5]/70 font-mono tracking-widest block uppercase font-bold">DEBIT WALLET</span>
                  <h4 className="text-sm font-bold text-white tracking-wide mt-1">{user.fullName}</h4>
                </div>

                <div>
                  <span className="text-[8px] text-[#FAFAF5]/60 font-mono block">REMAINING CAPITAL</span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    {account ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(account.balance) : '---'}
                  </h3>
                </div>

                <div className="flex justify-between items-center text-[9px] text-[#FAFAF5]/70 font-mono">
                  <span>ID: {user.accountNumber}</span>
                  <span className="text-[#52B788] font-bold">ACTIVE</span>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
