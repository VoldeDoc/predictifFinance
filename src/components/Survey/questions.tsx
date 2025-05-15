export const questionnaire = [
    {
        title: 'Demographics',
        questions: [
            {
                id: 'age',
                label: 'Age',
                type: 'text',
                placeholder: 'Enter your age',
            },
            {
                id: 'geneder',
                label: 'Gender',
                type: 'select',
                options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
            },
            {
                id: 'country',
                label: 'Country',
                type: 'text',
                placeholder: 'Enter your country',
            },
            {
                id: 'state',
                label: 'State',
                type: 'text',
                placeholder: 'Enter your state',
            },
            {
                id: 'occupation',
                label: 'Occupation',
                type: 'text',
                placeholder: 'Enter your occupation',
            },
        ],
    },
    {
        title: 'Investment Experience',
        questions: [
            {
                id: 'long_investing',
                label: 'How long have you been investing in financial assets?',
                type: 'select',
                options: ['Less than 1 year', '1-3 years', '3-5 years', '5+ years'],
            },
            {
                id: 'often_review_invest_portolio',
                label: 'How often do you review your investment portfolio?',
                type: 'select',
                options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Rarely'],
            },
        ],
    },
    {
        title: 'Asset Preferences',
        questions: [
            {
                id: 'type_fin_assets',
                label: 'Which types of financial assets do you currently invest in? (Select all that apply)',
                type: 'multi-select',
                options: ['Stocks', 'Bonds', 'Mutual funds', 'ETFs (Exchange-Traded Funds)', 'Real estate', 'Cryptocurrencies', 'Other (please specify)'],
            },
            {
                id: 'portCompPer_stock',
                label: 'What percentage of your portfolio is allocated to Stocks?',
                type: 'text',
                placeholder: 'Enter percentage',
            },
            {
                id: 'portCompPer_bond',
                label: 'What percentage of your portfolio is allocated to Bonds?',
                type: 'text',
                placeholder: 'Enter percentage',
            },
            {
                id: 'portCompPer_mutEtf',
                label: 'What percentage of your portfolio is allocated to Mutual Funds/ETFs?',
                type: 'text',
                placeholder: 'Enter percentage',
            },
            {
                id: 'portCompPer_real_est',
                label: 'What percentage of your portfolio is allocated to Real Estate?',
                type: 'text',
                placeholder: 'Enter percentage',
            },
            {
                id: 'portCompPer_crypto',
                label: 'What percentage of your portfolio is allocated to Cryptocurrencies?',
                type: 'text',
                placeholder: 'Enter percentage',
            },
            {
                id: 'portCompPer_cash',
                label: 'What percentage of your portfolio is allocated to Cash or Cash Equivalents?',
                type: 'text',
                placeholder: 'Enter percentage',
            },
            {
                id: 'portCompper_other_name',
                label: 'Other asset type (please specify)',
                type: 'text',
                placeholder: 'Specify asset type',
            },
            {
                id: 'portCompper_other_per',
                label: 'What percentage of your portfolio is allocated to Other assets?',
                type: 'text',
                placeholder: 'Enter percentage',
            },
            {
                id: 'pri_investment_goal',
                label: 'What is your primary investment goal?',
                type: 'select',
                options: ['Capital appreciation', 'Income generation', 'Preservation of capital', 'Diversification', 'Other (please specify)'],
            },
        ],
    },
    {
        title: 'Risk Tolerance',
        questions: [
            {
                id: 'risk_tolerance',
                label: 'How would you describe your risk tolerance?',
                type: 'select',
                options: ['Very high', 'High', 'Moderate', 'Low', 'Very low'],
            },
            {
                id: 'believe_ai',
                label: 'What investment strategies do you believe AI could enhance? (Select all that apply)',
                type: 'multi-select',
                options: ['Long-term investing', 'Short-term trading', 'Value investing', 'Growth investing', 'Risk management'],
            },
            {
                id: 'market_down',
                label: 'In the event of a market downturn, how would you typically react?',
                type: 'select',
                options: ['Sell off assets to minimize losses', 'Hold assets and wait for recovery', 'Buy more assets to take advantage of lower prices', 'Other (please specify)'],
            },
        ],
    },
    {
        title: 'Investment Strategies',
        questions: [
            {
                id: 'insestment_strategy',
                label: 'Which investment strategies do you prefer? (Select all that apply)',
                type: 'multi-select',
                options: ['Value investing', 'Growth investing', 'Income investing', 'Index investing', 'Day trading', 'Other (please specify)'],
            },
            {
                id: 'follow_investment_advice',
                label: 'Do you follow any specific resources for investment advice?',
                type: 'select',
                options: ['Yes (please specify)', 'No'],
            },
        ],
    },
    {
        title: 'Financial Planning',
        questions: [
            {
                id: 'do_advisor',
                label: 'Do you have a financial advisor?',
                type: 'select',
                options: ['Yes', 'No'],
            },
            {
                id: 'invest_budget',
                label: 'How do you usually set your investment budget?',
                type: 'select',
                options: ['Fixed monthly contributions', 'Percentage of income', 'Based on market conditions', 'No specific budget'],
            },
            {
                id: 'diverser_investment',
                label: 'How important is diversification in your investment strategy?',
                type: 'select',
                options: ['Very important', 'Somewhat important', 'Not important'],
            },
        ],
    },
    {
        title: 'AI in Investment',
        questions: [
            {
                id: 'aitool_decision',
                label: 'Do you utilize AI tools for investment decisions?',
                type: 'select',
                options: ['Yes', 'No'],
            },
            {
                id: 'ai_benefit',
                label: 'What aspects of AI do you find most beneficial for your investments? (Select all that apply)',
                type: 'multi-select',
                options: ['Predictive analytics', 'Automated trading', 'Sentiment analysis', 'Risk assessment', 'Portfolio optimization'],
            },
            {
                id: 'ai_aspect',
                label: 'Which aspects do you use AI for? (Select all that apply)',
                type: 'multi-select',
                options: ['Market analysis', 'Predictive analytics', 'Portfolio management', 'Risk assessment', 'Other (please specify)'],
            },
            {
                id: 'ai_comfortable_using',
                label: 'How comfortable are you with using AI in your investment strategy?',
                type: 'select',
                options: ['Very comfortable', 'Somewhat comfortable', 'Neutral', 'Somewhat uncomfortable', 'Very uncomfortable'],
            },
        ],
    },
    {
        title: 'Current Events Influence',
        questions: [
            {
                id: 'consider_event_current',
                label: 'How often do you consider current events when making investment decisions?',
                type: 'select',
                options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
            },
            {
                id: 'belief_event_current_affect',
                label: 'Which types of current events do you believe most affect your investments? (Select all that apply)',
                type: 'multi-select',
                options: ['Economic reports (e.g., GDP, unemployment rates)', 'Political events (e.g., elections, legislation)', 'Global crises (e.g., pandemics, natural disasters)', 'Market trends (e.g., tech advancements, industry shifts)'],
            },
        ],
    },
    {
        title: 'General Attitudes',
        questions: [
            {
                id: 'role_researcher_invest',
                label: 'How do you view the role of research vs. intuition in investing?',
                type: 'select',
                options: ['Research is more important', 'Intuition is more important', 'Both are equally important'],
            },
            {
                id: 'challenges_invest',
                label: 'Have you experienced any significant challenges with investing?',
                type: 'select',
                options: ['Yes (please describe)', 'No'],
            },
            {
                id: 'improvement_platform',
                label: 'What improvements or features would you like to see in investment platforms?',
                type: 'text',
                placeholder: 'Enter your suggestions',
            },
            {
                id: 'concerns_ai_invest',
                label: 'What concerns do you have regarding the use of AI in investing?',
                type: 'text',
                placeholder: 'Enter your concerns',
            },
            {
                id: 'see_ai_invest_years',
                label: 'How do you see the role of AI in your investment strategy in the next 5 years?',
                type: 'text',
                placeholder: 'Share your thoughts',
            },
            {
                id: 'additional_comment_ai',
                label: 'Any additional comments or insights on how current events and AI influence your investment decisions?',
                type: 'text',
                placeholder: 'Enter additional comments',
            },
            {
                id: 'additional_comment_preference',
                label: 'Any additional comments or insights on your investment preferences?',
                type: 'text',
                placeholder: 'Enter additional comments',
            },
        ],
    },
];