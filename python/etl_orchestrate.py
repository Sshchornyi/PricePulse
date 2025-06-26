import schedule
import time
from scripts.bronze import scrape_flowers
from scripts.silver import transform_to_silver
from scripts.gold import create_views

def run_etl():
    print("🔄 Starting ETL process...")

    try:
        print("🟫 Bronze layer")
        scrape_flowers()

        print("🥈 Silver layer")
        transform_to_silver()

        print("🥇 Gold layer")
        create_views()

        print("✅ ETL completed successfully.")
    except Exception as e:
        print(f"❌ ETL failed: {e}")

# 🕒 Every day on 10:00 a.m.
schedule.every().day.at("14:44").do(run_etl)

print("⏳ Scheduler started. Waiting for job...")
while True:
    schedule.run_pending()
    time.sleep(60)
