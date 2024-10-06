import UserHeader from "../Components/UserHeader.jsx"
import UserPost from "../Components/UserPost.jsx"


const UserPage = () => {
  return (
    <>
      <UserHeader  />
      <UserPost likes={1200} replies={481} postImg='/post1.png' postTitle='What have you done' />
      <UserPost likes={321} replies={50} postImg='/post3.png' postTitle='Make an image for yourself' />
      <UserPost likes={8} replies={3} postImg='/hello.jpg'postTitle='Haryy lost his mind' />
      <UserPost likes={231} replies={56} postImg='/download.jpeg'postTitle='The babies are the most beautiful' />
    </>
  )
}

export default UserPage
