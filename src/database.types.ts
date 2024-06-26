export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      order_items: {
        Row: {
          comboPrice: number;
          created_at: string;
          id: number;
          orderId: number;
          productId: number;
          quantity: number;
          selectedSize: number;
        };
        Insert: {
          comboPrice?: number;
          created_at?: string;
          id?: number;
          orderId: number;
          productId: number;
          quantity?: number;
          selectedSize?: number;
        };
        Update: {
          comboPrice?: number;
          created_at?: string;
          id?: number;
          orderId?: number;
          productId?: number;
          quantity?: number;
          selectedSize?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_order_items_orderId_fkey";
            columns: ["orderId"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_order_items_productId_fkey";
            columns: ["productId"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string;
          delivery: string;
          deliveryDate: string;
          id: number;
          paymentMethod: string;
          status: string;
          total: number;
          type: string;
          userId: string;
        };
        Insert: {
          created_at?: string;
          delivery?: string;
          deliveryDate?: string;
          id?: number;
          paymentMethod?: string;
          status?: string;
          total?: number;
          type?: string;
          userId: string;
        };
        Update: {
          created_at?: string;
          delivery?: string;
          deliveryDate?: string;
          id?: number;
          paymentMethod?: string;
          status?: string;
          total?: number;
          type?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_orders_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_fingerprints: {
        Row: {
          created_at: string;
          customer_id: string;
          fingerprint: string;
          id: number;
          payment_method_id: string | null;
        };
        Insert: {
          created_at?: string;
          customer_id: string;
          fingerprint: string;
          id?: number;
          payment_method_id?: string | null;
        };
        Update: {
          created_at?: string;
          customer_id?: string;
          fingerprint?: string;
          id?: number;
          payment_method_id?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          created_at: string;
          desc: string | null;
          id: number;
          image: string | null;
          name: string;
          price: number;
          size: number | null;
        };
        Insert: {
          created_at?: string;
          desc?: string | null;
          id?: number;
          image?: string | null;
          name: string;
          price: number;
          size?: number | null;
        };
        Update: {
          created_at?: string;
          desc?: string | null;
          id?: number;
          image?: string | null;
          name?: string;
          price?: number;
          size?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          expo_push_token: string | null;
          full_name: string | null;
          group: string;
          id: string;
          stripe_customer_id: string | null;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          id: string;
          avatar_url?: string | null;
          full_name?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          expo_push_token?: string | null;
          full_name?: string | null;
          group?: string;
          id?: string;
          stripe_customer_id?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
