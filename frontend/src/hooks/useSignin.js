import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";


const useSignin = () => {
    const queryClient = useQueryClient();
  const {
    mutate: signupMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
  });
  return {mutate:signupMutation, isPending, error}
}

export default useSignin