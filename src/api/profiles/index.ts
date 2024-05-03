import { supabase } from "@/lib/supabase";
import { InsertTables } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Path: src/hooks/useProductList.ts

export const useProfile = (id: number) => {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTables<"profiles">) => {
      const { error, data: updatedUser } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name || "",
          username: data.username || "",
          avatar_url: data.avatar_url || "",
        })
        .eq("id", data.id) // Ensure you use the userId as a condition
        .single(); // Ensure only one row is updated

      if (error) {
        throw new Error(error.message);
      }

      return updatedUser;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
};

// export const useUpdateProduct = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (data: any) => {
//       const { error, data: newProduct } = await supabase
//         .from("products")
//         .update({
//           name: data.name,
//           price: data.price,
//           image: data.image,
//         })
//         .eq("id", data.id)
//         .select()
//         .single();
//       if (error) {
//         throw new Error(error.message);
//       }
//       return newProduct;
//     },
//     async onSuccess(_, { id }) {
//       await queryClient.invalidateQueries({ queryKey: ["products"] });
//       await queryClient.invalidateQueries({ queryKey: ["product", id] });
//     },
//   });
// };

// export const useDeleteProduct = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (id: number) => {
//       const { error } = await supabase.from("products").delete().eq("id", id);
//       if (error) {
//         throw new Error(error.message);
//       }
//     },
//     async onSuccess() {
//       await queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });
// };
