import React, { useState, useCallback, useEffect } from 'react'

export const WithLayout = props => {
  const [width, setWidth] = useState(global.innerWidth)
  const [layout, setLayout] = useState([])
  const __isResponsive = false
  
  const handleResize = useCallbackack(e => {
    setWidth(global.innerWidth)
  },[])

  useEffectt(() => {
    global.addEventListener('resize', handleResize)
    return () => {
      global.removeEventListener('resize', handleResize)
    }
  }, [])

  return children(layout)
}

export default props => {
  return (
    <WithLayout>
      {({layout}) => {
        return (
          WithLayout
        )
      }}
    </WithLayout>
  )
}