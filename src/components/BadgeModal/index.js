import React from 'react'
import styled from 'styled-components'

import Modal from '../Modal'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin: auto;
  position: relative;
`

const Closer = styled.img`
  position: absolute;
  top: 15px;
  right: 15px;
  height: 15px;
  width: 15px;
  color: ${({ theme }) => theme.buttonOutlineGrey};

  :hover {
    cursor: pointer;
  }
`

const Name = styled.div`
  margin-top: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  width: 80%;
  text-align: center;
  overflow-wrap: balance;
`

const Badge = styled.img`
  height: 300px;
`

const Description = styled.div`
  margin: 20px auto;
  height: 80%;
  width: 90%;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  margin-bottom: 15px;
`

const Resource = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.makerOrange};

  :hover {
    text-decoration: underline;
  }
`

const Status = styled.div`
  color: ${({ theme }) => theme.makerOrange};
`

const Redeem = styled.button`
  width: 100px;
  height: 25px;
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.makerTeal};
  border: 1px solid ${({ theme }) => theme.white};
  font-weight: bold;

  :hover {
    cursor: pointer;
    box-shadow: 1px 2px 2px ${({ theme }) => theme.makerOrange};
  }
`

export default function BadgeModal({ badge, isOpen, onDismiss, onRedeem, onUnlock }) {
  return (
    <Modal style={{ userSelect: 'none' }} isOpen={isOpen} onDismiss={onDismiss} minHeight={null} maxHeight={90}>
      {badge && (
        <Wrapper>
          <Closer
            src={require('../../assets/images/x.svg')}
            alt="close modal"
            onClick={() => {
              onDismiss()
            }}
          />
          <Name dangerouslySetInnerHTML={{ __html: badge.longName }} />
          <div style={{ display: 'flex', flexDirection: 'row', height: '350px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%'
              }}
            >
              <Badge src={require('../../assets/images/badges/' + badge.imgPath)} alt={badge.name} />
              {/* <Stage /> */}
            </div>
            <div style={{ width: '50%' }}>
              <Description>
                <div>{badge.description}</div>
                <div>
                  <b>Steps:</b>
                  <ol>
                    {Object.keys(badge.steps).map(step => {
                      return <li key={step} dangerouslySetInnerHTML={{ __html: badge.steps[step] }} />
                    })}
                  </ol>
                </div>
                {badge.note && <div>Note: {badge.note}</div>}
              </Description>
            </div>
          </div>
          <Footer>
            {badge.unlocked && badge.redeemed ? <Status>Redeemed!</Status> : null}
            {!badge.unlocked && <Status>Get Started</Status>}
            <Resource href={badge.resource} target="_blank" rel="noopener noreferrer">
              {!badge.unlocked ? badge.resource + ' →' : !badge.redeemed ? 'Unlocked!' : null}
            </Resource>
            {!badge.redeemed &&
              badge.unlocked &&
              (badge.proof ? (
                <Redeem onClick={() => onRedeem(badge.proof, badge.id)}>Redeem</Redeem>
              ) : (
                <Redeem onClick={() => onUnlock(badge.id)}>Unlock!</Redeem>
              ))}
          </Footer>
        </Wrapper>
      )}
    </Modal>
  )
}
