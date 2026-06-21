import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";


export const useLogin = () => {
    const QueryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => QueryClient.invalidateQueries({ queryKey: ['authUser'] }),
  });
  return {error, isPending, loginMutation:mutate}
};
