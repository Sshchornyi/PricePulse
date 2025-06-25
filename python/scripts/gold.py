import pandas as pd
import os

def transform_to_gold():
    df = pd.read_parquet("data/silver/products_clean.parquet")

    summary = df.groupby("category")["price"].sum().reset_index()
    summary.rename(columns={"price": "total_sales"}, inplace=True)

    os.makedirs("data/gold", exist_ok=True)
    summary.to_csv("data/gold/sales_summary.csv", index=False)
    print("✅ Gold data saved.")
