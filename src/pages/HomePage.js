import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import Profile from '../features/user/Profile';
import FriendList from '../features/friend/FriendList';
import AddFriend from '../features/friend/AddFriend';
import SentRequest from '../features/friend/SentRequest';
import { capitalCase } from 'change-case';


// mui
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PeopleIcon from '@mui/icons-material/People';
import { ContactMail, PersonAddRounded } from '@mui/icons-material';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import { Box, Card, Container, styled, Tab, Tabs } from '@mui/material';
import ProfileCover from '../features/user/ProfileCover';
import FriendRequests from '../features/friend/FriendRequests';


const TabsWrapperStyle = styled('div')(({theme}) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: '#fff',
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center'
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3)
  },

}))

function HomePage() {
  const { user } = useAuth()
  const [selectTab , setSelectTab] = useState('profile')

  const handleChangeTab = (value) => {
    setSelectTab(value)
  }

  const PROFILE_TABS = [
    { 
      value: 'profile',
      icon: <AccountBoxIcon sx={{fontSize: 24}} />,
      component: <Profile profile={user} />
    },
    { 
      value: 'friends',
      icon: <PeopleIcon sx={{fontSize: 24}}/>,
      component: <FriendList/>
    },
    { 
      value: 'requests',
      icon: <ContactMail sx={{fontSize: 24}}/>,
      component: <FriendRequests/>
    },
    { 
      value: 'add_friend',
      icon: <PersonAddRounded sx={{fontSize: 24}}/>,
      component: <AddFriend />
    },
    { 
      value: 'sent_request',
      icon: <CoPresentIcon sx={{fontSize: 24}}/>,
      component: <SentRequest/>
    },

  ]
  return (
    <Container>
      <Card
      sx={{
        mb: 3,
        height: 280,
        position: 'relative',
      }}>
        <ProfileCover profile={user}/>

        <TabsWrapperStyle>
          <Tabs
            value={selectTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={(e, value) => handleChangeTab(value)}
            >
            {PROFILE_TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={capitalCase(tab.value)}
                />
                ))}
          </Tabs>
        </TabsWrapperStyle>
      </Card>


        {PROFILE_TABS.map((tab)=> {
          const isMatched = tab.value === selectTab
          return isMatched && <Box key={tab.value}>{tab.component}</Box> 
        })}
      
    </Container>
  )
}

export default HomePage