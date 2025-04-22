import express from "express";
import fetch from "node-fetch";

const app = express();
const port = 3000;

app.get("/stock-insight", async (req, res) => {
  const currency = req.query.currency || "usd";

  if (!["usd", "brl"].includes(currency)) {
    return res.status(400).json({
      error: "Moeda inválida. Use currency=usd ou currency=brl",
    });
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`,
    );
    const data = await response.json();
    const btcPrice = data.bitcoin[currency];

    let suggestion = "";

    if (currency === "brl") {
      if (btcPrice < 300000) suggestion = "Bom momento para compra!";
      else if (btcPrice <= 450000)
        suggestion = "Preço razoável. Avalie antes de comprar.";
      else suggestion = "Bitcoin está caro. Pode ser melhor esperar.";
    } else {
      if (btcPrice < 60000) suggestion = "Bom momento para compra!";
      else if (btcPrice <= 80000)
        suggestion = "Preço razoável. Avalie antes de comprar.";
      else suggestion = "Bitcoin está caro. Pode ser melhor esperar.";
    }

    res.json({
      btc_price: btcPrice,
      currency,
      suggestion,
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar dados da CoinGecko.",
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
