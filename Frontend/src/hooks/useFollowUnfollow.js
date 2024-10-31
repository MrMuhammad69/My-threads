import { useState } from "react"
import useShowToast from "./useShowToast"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/user.atom"
const useFollowUnfollow = (user) => {
    const showToast = useShowToast()
    const currentUser = useRecoilValue(userAtom)
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id))
    const [updating, setUpdating] = useState(false)
    
    const handleFollowUnfollow = async () => {
        if (!currentUser) {
         showToast('Error', 'You have to login in order to Follow', 'error')
          return
        }
        if(updating) return;
        setUpdating(true)
        try {
          const res = await fetch(`/api/users/follow/${user._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': "application/json"
            }
          })
          const data = await res.json()
          if (data.error) {
            showToast('Error', data.error, 'error')
            return
          }
          setFollowing(!following)
          if(following){
            showToast('Success', `You have unfollowed ${user.name}`, 'success')
            user.followers.pop()
    
          } else{
            showToast("Success", `You have followed ${user.name}`, 'success')
            user.followers.push(currentUser?._id)
          }
        } catch (error) {
          showToast("Error", error, 'error')
        } finally{
          setUpdating(false)
        }
      }
  return {handleFollowUnfollow, updating, following, setFollowing}

}

export default useFollowUnfollow
