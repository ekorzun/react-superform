import * as React from 'react'

const RowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flex: '0 1 auto',
  alignContent: `stretch`
}

/**
 * 
 */
export const Row = ({
  className,
  style,
  children,
  ...other
}: {
  className ?: string | undefined;
  style ?: React.CSSProperties | undefined;
  children: React.ReactNode
}) => (
    <div
      style={{
        ...RowStyle,
        ...style
      }}
      className={className}
      {...other}
    >
      {children}
    </div>
  )

/**
 * 
 */
export const Col = ({
  children,
  className,
  width,
  style,
  ...other
}: {
  width ?: number;
  className ?: string | undefined;
  style ?: React.CSSProperties | undefined;
  children: React.ReactNode
}) => (
  <div
    style={{
      ...style,
      flex: width ? `0 0 ${100 * width / 12}%` : '1'
    }}
    className={className}
    {...other}
  >
    {children}
  </div>
)
