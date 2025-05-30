
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
    icon: string;
    startDate?: string;
    endDate?: string;
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

  export interface Signup{
    first_name: string;
    last_name: string;
    other_name: string;
    email: string;
    password: string;
    phone: string;
    password_confirmation: string;
    username: string;
  }

  export interface ChangePassword{
    otp: string;
    new_password: string;
    new_password_confirmation: string;
  }

  export interface SurveyDataValues {
    age: string;
    geneder: string;
    country: string;
    state: string;
    occupation: string;
    long_investing: string; // How long have you been investing in financial assets
    often_review_invest_portolio: string; // How often do you review your investment portfolio
    type_fin_assets: string[]; // Which types of financial assets do you currently invest in
    portCompPer_stock: string; // Portfolio composition percentage - stocks
    portCompPer_bond: string; // Portfolio composition percentage - bonds
    portCompPer_mutEtf: string; // Portfolio composition percentage - mutual funds/ETFs
    portCompPer_real_est: string; // Portfolio composition percentage - real estate
    portCompPer_crypto: string; // Portfolio composition percentage - crypto
    portCompPer_cash: string; // Portfolio composition percentage - cash
    portCompper_other_name?: string;
    portCompper_other_per: string;
    pri_investment_goal: string; // Primary investment goal
    risk_tolerance: string; // Risk tolerance level
    believe_ai: string[]; // Investment strategies AI could enhance
    market_down: string; // Reaction to market downturn
    insestment_strategy: string[]; // Preferred investment strategies
    follow_investment_advice: string; // Following specific resources for investment advice
    do_advisor: string; // Whether you have a financial advisor
    invest_budget: string; // How you set investment budget
    diverser_investment: string; // Importance of diversification
    aitool_decision: string; // AI tools utilization for investment
    ai_benefit: string[]; // Most beneficial aspects of AI
    ai_aspect: string[]; // Aspects using AI for
    ai_comfortable_using: string; // Comfort level using AI
    consider_event_current: string; // Frequency of considering current events
    belief_event_current_affect: string[]; // Types of events affecting investments
    role_researcher_invest: string; // View on research vs intuition
    challenges_invest: string; // Significant challenges with investing
    improvement_platform: string; // Desired improvements in investment platforms
    concerns_ai_invest: string; // Concerns about AI in investing
    see_ai_invest_years: string; // Future role of AI in investment strategy
    additional_comment_ai: string; // Additional comments on events and AI
    additional_comment_preference: string; // Additional comments on investment preferences
  }

  export interface KycItem {
  type: 'text' | 'file';  // Type of the KYC field
  key: string;           // Key like "label", "detail", etc.
  value: string | File;  // The value (text or file)
}

export interface KycData {
  kyc: KycItem[];
}

  export interface createGroupValues{
    name:string;
    description:string;
  }

  export interface sendMessageValues{
    group_id : number;
    message : string;
  }


  export interface editMessageValues{
    group_id : number;
    message : string;
    message_id : number;
  }

  export interface deleteMessageValues{
    group_id:number
  }

  export interface addMembersValues{
  group_id:number;
  user_id:number[];
  }

  export interface UserRole {
    user_id: number;
    role: string;
}

export interface AssignMemberRoleValues {
    group_id: number;
    user_role: UserRole[];
}

export interface deleteMessageValues {
    group_id: number;
    message_id: number;
    delete_type: string;
}


export interface createStrategyValues {
  name:string;
  description:string;
  strategy_id:number;
  max_number?:string;
  min_number?:string;
  item_id:string;
  item:string;
  endDate?:string;
}


export interface updateStreategyValues{
  name:string;
  description:string;
  strategy_id:number;
  max_number?:string;
  min_number?:string;
  team_player_id:string;
  team_player:string;
  endDate?:string;
}


