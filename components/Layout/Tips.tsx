import cardstyles from '@/styles/card.module.css'

export const GreenTip = ({ header, children }) => (
  <div className={cardstyles.greencard}>
    <h4>💡 {header}</h4>
    <p>{children}</p>
  </div>
)
