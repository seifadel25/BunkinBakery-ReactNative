import { Tables } from "@/database.types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { InsertTables, Order, UpdateTables } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useAdminOrderList = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useUserOrderList = () => {
  const { session } = useAuth();
  const id = session?.user.id;
  return useQuery({
    queryKey: ["orders", { userId: id }],
    queryFn: async () => {
      if (!id) {
        return [];
      }
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("userId", id)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `*,
    order_items (
      id,
      productId,
      quantity,
      size,
      created_at,
      products (
        id,
        name,
        price,
        image
      )
    )
  `
        )
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const id = session?.user.id;
  return useMutation({
    mutationFn: async (data: InsertTables<"orders">) => {
      const { error, data: newProduct } = await supabase
        .from("orders")
        .insert({ ...data, userId: id || "" })
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess(data) {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<"orders">;
    }) => {
      const { error, data: upatedOrder } = await supabase
        .from("orders")
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return upatedOrder;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
//////////////////////////////Order Items////////////////////////////////////

export const useInsertOrderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderItems: InsertTables<"order_items">[]) => {
      const { error, data: newProduct } = await supabase
        .from("order_items")
        .insert(orderItems)
        .select();
      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["order_items"] });
    },
  });
};

export const useOrderItemsList = (id: number) => {
  return useQuery({
    queryKey: ["order_items", { orderId: id }],
    queryFn: async () => {
      if (!id) {
        return [];
      }
      const { data, error } = await supabase
        .from("order_items")
        .select("*, products(*)")
        .eq("orderId", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

//////////////////////////////Order Subscriptions////////////////////////////////////
export const useOrderListSubs = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const orderSubs = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          console.log("Change received!", payload);
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();
    return () => {
      orderSubs.unsubscribe();
    };
  }, []);
};

export const useUpdateOrderStatusSubs = (id: number) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const orders = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["orders", id] });
        }
      )
      .subscribe();

    return () => {
      orders.unsubscribe();
    };
  }, []);
};
export const useOrderStatusSubs = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const orders = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      orders.unsubscribe();
    };
  }, []);
};
