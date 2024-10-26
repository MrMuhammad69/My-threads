import { useParams } from 'react-router';
import useShowToast from './useShowToast';
import { useEffect, useState } from 'react';

const useGetUserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Set initial loading to true
    const { username } = useParams();
    const showToast = useShowToast();

    useEffect(() => {
        const getUser = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();

                if (data.error) {
                    showToast("Error", data.error, 'error');
                    setUser(null); // Explicitly set user to null if there's an error
                } else {
                    setUser(data);
                }
            } catch (error) {
                showToast("Error", error.message, 'error');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [username, showToast]);

    return { loading, user };
};

export default useGetUserProfile;
