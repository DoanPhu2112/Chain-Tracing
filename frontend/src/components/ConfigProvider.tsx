import React from 'react'
import { ConfigProvider, Modal } from 'antd'

const ConfigProviderHelper = () => {
  return (
    <ConfigProvider>
      
        theme={{
            components: {
              Modal:{
                titleFontSize: '40px',
              },
                Button: {
                colorPrimary: '#00b96b',
                algorithm: true, // Enable algorithm
                },
                Input: {
                colorPrimary: '#eb2f96',
                algorithm: true, // Enable algorithm
                }
            },
        }}
    </ConfigProvider>
  )
}

export default ConfigProviderHelper