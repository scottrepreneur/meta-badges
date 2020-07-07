
import React, { useState } from 'react'
import styled from 'styled-components'

import { lighten, darken } from 'polished'
import { useBadgeList } from '../../contexts/Application'
import Spinner from '../Spinner'
import BadgeModal from '../BadgeModal'

import { useFactoryContract } from '../../hooks'

const Heading = styled.div`
  h1 {
    margin-top: 30px;
    text-align: center;
  }
`

const BadgesWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const Wrapper = styled.div`
  position: relative;
`

const Badge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 13px;
  width: 9rem;
  height: 12rem;
  padding: 15px;
  margin: 15px;
  border: 1px solid ${({ theme }) => darken(0.1, theme.backgroundColor)};
  background-color: ${({ theme }) => lighten(0.1, theme.backgroundColor)};
  box-shadow:  ${({ theme, unlocked }) => unlocked ? '0 0 4px 4px' + lighten(0.3, theme.makerTeal) : '0px 4px 4px' + darken(0.1, theme.backgroundColor)};
  border-radius: 5px;
  position: relative;

  img {
    height: 90%;
  }

  :hover {
    cursor: pointer;
    background: ${({ theme }) => lighten(0.3, theme.backgroundColor)};
    box-shadow: 0 0 4px 4px ${({ theme }) => lighten(0.3, theme.makerTeal)};

    // & > p {
    //   color: white;
    // }

    & > div {
      display: none;
    }
  }
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: ${({ theme }) => darken(0.1, theme.backgroundColor)};
  opacity: 0.5;
`

const RedeemButton = styled.button`
  width: 115px;
  height: 30px;
  z-index: 5;
  position: absolute;
  top: 120px;
  left: 45px;
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.makerTeal};
  border: 1px solid ${({ theme }) => theme.white};
  font-weight: bold;

  :hover {
    cursor: pointer;
    box-shadow: 1px 2px 2px ${({ theme }) => theme.makerTeal};
  }
`

const Loading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

export default function BadgeList({ params }) {
  const badgeList = useBadgeList()

  const contract = useFactoryContract()

  const [openBadge, setOpenBadge] = useState(null)
  const [showModal, setShowModal] = useState(false)

  async function onRedeem(proof, templateId) {
    console.log(proof)

    let result = await contract.activateBadge(proof, templateId-1, "token.json");
    console.log(result);
  }

  return (
    <>
    { badgeList && badgeList.length > 0 ? (
      <>
        <BadgeModal 
          badge={openBadge}
          isOpen={showModal}
          onRedeem={onRedeem}
          onDismiss={() => {
            setShowModal(false)
          }}
        />
        <Heading>
            <h1>My Badges</h1>
        </Heading>
        <BadgesWrapper>
          {Object.keys(badgeList).map(key => {
            const badge = badgeList[key]
            if ((badge.parent !== 0 && badgeList[badge.parent-1]['redeemed'] === 1) || badge.parent === 0) {
                // console.log(badge.id)
                return(
                    <Wrapper 
                      key={badge.id}
                    >
                      {badge.unlocked && !badge.redeemed 
                        ? <RedeemButton>Redeem</RedeemButton>
                        : null
                      }
                      <Badge
                        key={badge.id}
                        unlocked={badge.unlocked === 1}
                        onClick={() => {
                          setOpenBadge(badge)
                          setShowModal(true)
                        }}
                      >
                        {!badge.unlocked && <Overlay />}
                        <img 
                          src={require('../../assets/images/badges/' + badge.imgPath)} 
                          alt={badge.name}
                        />
                        <p>
                          {badge.name}
                        </p>
                      </Badge>
                    </Wrapper>
                  )
                }
            return null;
          })}
        </BadgesWrapper>
      </> 
      ) : (
        <Loading>
          <Spinner />
        </Loading>
      )   
    } 
    </>
  )
}
