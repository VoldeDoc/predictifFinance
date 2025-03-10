
export interface DailyLimitProps {
    spentAmount?: number;
    limit?: number;
    currency?: string;
  }

export interface SavingPlanItem {
    id: string;
    name: string;
    target: number;
    current: number;
    icon?: string; 
}

export interface Savings {
    savings?: number;
    currency?: string;
}


export interface CreditCardProps {
  cardNumber?: string;
  cardholderName?: string;
  expiryDate?: string;
  cvv?: string;
  cardType?: string;
}

export interface CardProps {
    icon?: React.ReactNode;
    title?: string;
    amount?: number;
    percentageChange?: number;
    currency?: string;
  }