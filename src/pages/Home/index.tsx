import style from "./style.module.css";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent, useEffect } from "react";

export interface CoinsProps {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
  formatedMarket?: string;
  formatedVolume?: string;
  formatedPrice?: string;
}

export const price = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const priceCompact = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
});

export function Home() {
  const [input, setInput] = useState<string>("");
  const navigate = useNavigate();
  const [coins, setCoins] = useState<CoinsProps[]>([]);
  const [limit, setLimit] = useState(0);
  const [load, setLoad] = useState<boolean>(false);

  interface DataProps {
    data: CoinsProps[];
  }

  useEffect(() => {
    getData();
  }, [limit]);

  async function getData() {
    setLoad(true);
    fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${limit}`)
      .then((response) => response.json())
      .then((data: DataProps) => {
        const coinsData = data.data;
        const formatedResult = coinsData.map((coin) => {
          const formated = {
            ...coin,
            formatedPrice: price.format(Number(coin.priceUsd)),
            formatedVolume: priceCompact.format(Number(coin.volumeUsd24Hr)),
            formatedMarket: priceCompact.format(Number(coin.marketCapUsd)),
          };
          return formated;
        });
        setLoad(false);
        const listCoins = [...coins, ...formatedResult];
        setCoins(listCoins);
      });
  }

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    if (input === "") {
      alert("Digite um valor válido!");
      return;
    }
    navigate(`/detail/${input}`);
  }

  function handleGetMore(): void {
    setLimit(limit + 10);
  }

  return (
    <main className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <input
          className={style.input}
          placeholder="Pesquise o nome da Criptomoeda"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className={style.button}>
          <BsSearch size={25} color="#fff" />
        </button>
      </form>
      <table>
        <thead className={style.thead}>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>
        <tbody className={style.tbody}>
          {coins?.length > 0 &&
            coins?.map((coin) => (
              <tr key={coin.id} className={style.tr}>
                <td className={style.tdLabel} data-label="Moeda">
                  <div className={style.cripto}>
                    <img
                      className={style.img}
                      src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                      alt="LogoCripto"
                    />
                    <Link className={style.name} to={`/detail/${coin.id}`}>
                      <span>{coin.name}</span> | {coin.symbol}
                    </Link>
                  </div>
                </td>
                <td className={style.tdLabel} data-label="Valor Mercado">
                  {coin.formatedMarket}
                </td>
                <td className={style.tdLabel} data-label="Preço">
                  {coin.formatedPrice}
                </td>
                <td className={style.tdLabel} data-label="Volume">
                  {coin.formatedVolume}
                </td>
                <td
                  className={
                    Number(coin.changePercent24Hr) > 0
                      ? style.tdProfit
                      : style.tdLoss
                  }
                  data-label="Mudança 24H"
                >
                  <span>{Number(coin.changePercent24Hr).toFixed(2)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {load ? <h2 className={style.load}>Carregando...</h2> : <></>}
      <button className={style.buttonMais} onClick={handleGetMore}>
        Ver mais
      </button>
    </main>
  );
}
