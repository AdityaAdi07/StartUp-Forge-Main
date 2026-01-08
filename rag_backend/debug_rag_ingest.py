import pandas as pd
from rag import founder_row_to_text

print("Loading CSV...")
df = pd.read_csv("founders_cleaned.csv")
print(f"Columns: {df.columns}")

row = df.iloc[2] # Row with Bing (ActionIQ) - Index 2 might be row 4? 0,1,2.
# Row 0: 1upHealth
# Row 1: Aalto
# Row 2: ActionIQ

print(f"\nRow 2 Raw:\n{row}")
print(f"\nGenerated Text:\n{founder_row_to_text(row)}")

# Check row with Explicit Name
row = df[df['name'] == 'Bing'].iloc[0]
print(f"\nRow 'Bing' Raw:\n{row}")
print(f"\nGenerated Text:\n{founder_row_to_text(row)}")
