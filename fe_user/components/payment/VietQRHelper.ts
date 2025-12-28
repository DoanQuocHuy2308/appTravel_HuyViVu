// VietQR Helper - Quản lý cấu hình và tạo URL VietQR
export interface VietQRConfig {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  baseUrl: string;
}

export const vietQRConfig: VietQRConfig = {
  bankCode: '970415',
  accountNumber: '102873813822',
  accountName: 'DOAN QUOC HUY',
  baseUrl: 'https://api.vietqr.io/image/970415-102873813822-05v1T7u.jpg'
};

export const generateVietQRUrl = (
  amount: number,
  tourTitle: string,
  bookingCode: string
): string => {
  // Đảm bảo amount là số nguyên (VND không có phần thập phân)
  const finalAmount = Math.round(amount);
  
  const params = new URLSearchParams({
    accountName: vietQRConfig.accountName,
    amount: finalAmount.toString(),
    addInfo: `Tour: ${tourTitle} - ${bookingCode}`
  });
  
  return `${vietQRConfig.baseUrl}?${params.toString()}`;
};

export const getBankInfo = () => {
  return {
    bankName: 'Vietcombank',
    accountNumber: vietQRConfig.accountNumber,
    accountName: vietQRConfig.accountName,
    bankCode: vietQRConfig.bankCode
  };
};

// Danh sách các ngân hàng hỗ trợ VietQR
export const supportedBanks = [
  { code: '970415', name: 'Vietcombank', shortName: 'VCB' },
  { code: '970422', name: 'VietinBank', shortName: 'CTG' },
  { code: '970436', name: 'BIDV', shortName: 'BIDV' },
  { code: '970416', name: 'Agribank', shortName: 'AGB' },
  { code: '970403', name: 'Techcombank', shortName: 'TCB' },
  { code: '970428', name: 'MB Bank', shortName: 'MBB' },
  { code: '970441', name: 'VPBank', shortName: 'VPB' },
  { code: '970405', name: 'Sacombank', shortName: 'STB' },
  { code: '970429', name: 'ACB', shortName: 'ACB' },
  { code: '970414', name: 'TPBank', shortName: 'TPB' }
];
