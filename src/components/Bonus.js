import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Bonus.css";
import FireIcon from "../assets/FireIcon";
import BonusButton from "../assets/BonusButton";

const BonusComponent = () => {
  const [totalBonuses, setTotalBonuses] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [expiringBonuses, setExpiringBonuses] = useState("");

  useEffect(() => {
    async function fetchBonusInfo() {
      try {
        const accessTokenResponse = await axios.post(
          "http://84.201.188.117:5021/api/v3/clients/accesstoken",
          {
            idClient: "2c44d8c2-c89a-472e-aab3-9a8a29142315",
            accessToken: "",
            paramName: "device",
            paramValue: "7db72635-fd0a-46b9-813b-1627e3aa02ea",
            latitude: 0,
            longitude: 0,
            sourceQuery: 0,
          },
          {
            headers: {
              "Content-Type": "application/json",
              AccessKey: "891cf53c-01fc-4d74-a14c-592668b7a03c",
            },
          }
        );

        const accessToken = accessTokenResponse.data.accessToken;

        const bonusInfoResponse = await axios.get(
          `http://84.201.188.117:5003/api/v3/ibonus/generalinfo/${accessToken}`,
          {
            headers: {
              "Content-Type": "application/json",
              AccessKey: "891cf53c-01fc-4d74-a14c-592668b7a03c",
            },
          }
        );

        const bonusInfo = bonusInfoResponse.data;

        if (bonusInfo.resultOperation.status !== 0) {
          console.error("Error:", bonusInfo.resultOperation.message);
          return;
        }

        const { currentQuantity, dateBurning, forBurningQuantity } =
          bonusInfo.data;
        const formattedExpirationDate = new Date(
          dateBurning
        ).toLocaleDateString("ru-RU", {
          month: "numeric",
          day: "numeric",
        });

        setTotalBonuses(currentQuantity);
        setExpirationDate(formattedExpirationDate);
        setExpiringBonuses(forBurningQuantity);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBonusInfo();
  }, []);

  return (
    <div className="bonus-info-block">
      <div>
        <h2>{totalBonuses} бонусов </h2>
      </div>

      <div>
        <p>
          {expirationDate} сгорит
          <span className="fire-icon">
            <FireIcon />
          </span>
          {expiringBonuses} бонусов
        </p>
      </div>
      <div className="bonus-button">
        <BonusButton />
      </div>
    </div>
  );
};

export default BonusComponent;
