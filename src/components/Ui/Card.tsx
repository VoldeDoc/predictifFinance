import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  headerslot?: ReactNode;
  className?: string;
  bodyClass?: string;
  noborder?: boolean;
  titleClass?: string;
  headerslotClass?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerslot,
  className = "custom-class  bg-white ",
  bodyClass = "p-6",
  noborder,
  titleClass = "custom-class ",
  headerslotClass = "",
}) => {
  return (
    <div
      className={`
        card rounded-md   hadow-base
    ${className}
        `}
    >
      {(title || subtitle) && (
        <header className={`card-header ${noborder ? "no-border" : ""}`}>
          <div>
            {title && <div className={`card-title ${titleClass}`}>{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {headerslot && <div className={`card-header-slot ${headerslotClass}`}>{headerslot}</div>}
          
        </header>
      )}
      <main className={`card-body ${bodyClass}`}>{children}</main>
    </div>
  );
};

export default Card;
