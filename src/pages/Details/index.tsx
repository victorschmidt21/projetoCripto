import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CoinsProps } from "../Home";
import { price } from "../Home";
import { priceCompact } from "../Home";
import style from "./style.module.css";
interface ResponseData {
  data: CoinsProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ErrorData | ResponseData;

export function Details() {
  const { cripto } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinsProps>();
  const [load, setLoad] = useState<boolean>(false);
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoad(true);
      fetch(`https://api.coincap.io/v2/assets/${cripto}`)
        .then((response) => response.json())
        .then((data: DataProps) => {
          if ("error" in data) {
            alert(data.error);
            navigate("/");
            return;
          }
          const resultData = {
            ...data.data,
            formatedPrice: price.format(Number(data.data.priceUsd)),
            formatedVolume: priceCompact.format(
              Number(data.data.volumeUsd24Hr)
            ),
            formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
          };
          setCoin(resultData);
          setLoad(false);
        });
    } catch (error) {}
  }

  return (
    <div className={style.container}>
      {load ? (
        <h3 className={style.load}>Carregando...</h3>
      ) : (
        <>
          <h1>
            {coin?.name} | {coin?.symbol}
          </h1>
          <section className={style.content}>
            <img
              src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
            />
            <a>
              <span>
                <strong>Preço: </strong>
                {coin?.formatedPrice}
              </span>
            </a>
            <a>
              <span>
                <strong>Valor de mercado: </strong>
                {coin?.formatedMarket}
              </span>
            </a>
            <a>
              <span>
                <strong>Volume: </strong>
                {coin?.formatedVolume}
              </span>
            </a>
            <a>
              <span
                className={
                  Number(coin?.changePercent24Hr) > 0
                    ? style.profit
                    : style.loss
                }
              >
                <strong>Mudança 24H: </strong>
                {Number(coin?.changePercent24Hr).toFixed(2)}
              </span>
            </a>
          </section>
        </>
      )}
    </div>
  );
}
