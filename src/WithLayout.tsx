import * as React from 'react'
const { useState, useCallback, useEffect } = React

let resizeTimeoutId :NodeJS.Timeout

export const WithLayout = ({
  children
}:{
  children: Function
}) => {

  const [width, setWidth] = useState(window.innerWidth)
  const [layout, setLayout] = useState([])
  const __isResponsive = false

  const handleResize = useCallback(e => {
    clearTimeout(resizeTimeoutId)
    resizeTimeoutId = setTimeout(() => setWidth(window.innerWidth), 50)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return children(layout)
}

export default props => {
  return (
    <WithLayout layout={layout}>
      {({ layout }) => {
        return (
          WithLayout
        )
      }}
    </WithLayout>
  )
}