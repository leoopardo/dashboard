import { Layout, Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Content, Header } from 'antd/es/layout/layout'

export const Paysbet = () => {
  return (
    <Layout>
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <div className="demo-logo" />
      <Menu theme='light' mode="horizontal" defaultSelectedKeys={['2']}/>
    </Header>
    <Layout>
      <Sider width={200} >
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100vh', borderRight: 0 }}
   
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
       
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  </Layout>
  )
}
