import type { VercelRequest, VercelResponse } from "@vercel/node";
import MercadoPago, { Preference } from "mercadopago";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ error: "MP_ACCESS_TOKEN no configurado" });
  }

  const { items, cliente, numeroPedido } = req.body as {
    items: Array<{
      producto: { id: string | number; nombre: string; precioActual: number; categoria: string };
      quantity: number;
    }>;
    cliente: { nombre: string; telefono: string };
    numeroPedido: string;
  };

  const origin =
    req.headers.origin ||
    (req.headers.host ? `https://${req.headers.host}` : "https://kicare.com.ar");

  const client = new MercadoPago({ accessToken });
  const preference = new Preference(client);

  try {
    const result = await preference.create({
      body: {
        external_reference: numeroPedido,
        statement_descriptor: "KI CARE",
        items: items.map((i) => ({
          id: String(i.producto.id),
          title: i.producto.nombre,
          description: i.producto.categoria,
          quantity: i.quantity,
          unit_price: i.producto.precioActual,
          currency_id: "ARS",
        })),
        payer: {
          name: cliente.nombre,
          phone: { area_code: "54", number: cliente.telefono.replace(/\D/g, "") },
        },
        back_urls: {
          success: `${origin}/pedido/exitoso?ref=${numeroPedido}&status=approved`,
          failure: `${origin}/carrito?mp_status=failure`,
          pending: `${origin}/pedido/exitoso?ref=${numeroPedido}&status=pending`,
        },
        auto_return: "approved",
      },
    });

    return res.status(200).json({ init_point: result.init_point });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al crear preferencia";
    return res.status(500).json({ error: message });
  }
}
