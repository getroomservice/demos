import React, { useEffect, useState } from "react";

export const Centered = ({ children }) => {
  return (
    <div className="centered">
      <div className="inner">{children}</div>
      <style jsx>{`
        .centered {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
        }

        .inner {
          min-width: 640px;
        }
      `}</style>
    </div>
  );
};

export const FadeIn = ({
  children,
  show
}: {
  show?: boolean;
  children: any;
}) => {
  let internalShowing = show === undefined ? true : show;

  const [opacity, setOpacity] = useState(0.0);
  useEffect(() => {
    if (internalShowing) {
      setOpacity(1.0);
    } else {
      setOpacity(0.0);
    }
  }, [show]); // since FadeIn needs to recompute each time.

  return (
    <div className="fade-in">
      {children}
      <style jsx>{`
        .fade-in {
          opacity: ${opacity};
          transition: opacity 0.35s;
        }
      `}</style>
    </div>
  );
};
