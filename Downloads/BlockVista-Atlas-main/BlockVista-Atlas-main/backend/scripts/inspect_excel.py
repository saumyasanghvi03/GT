import pandas as pd
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'processed')
for f in os.listdir(DATA_DIR):
    if f.endswith(".xls") or f.endswith(".xlsx"):
        print(f"File: {f}")
        try:
            df = pd.read_excel(os.path.join(DATA_DIR, f), nrows=20, header=None)
            for i, row in df.iterrows():
                print(f"Row {i}: {row.values.tolist()}")
        except Exception as e:
            print(f"Error: {e}")
