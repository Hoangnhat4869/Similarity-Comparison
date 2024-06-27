import pandas as pd


data = pd.read_csv('output.csv')

py_score = 0
js_score = 0

for i in range(len(data)):
    if abs(data['Python code Similarity'][i] - data['label'][i]) < abs(data['TS code similarity'][i] - data['label'][i]):
        py_score += 1
    else:
        js_score += 1

print('Python score:', 100*py_score/len(data), '%')
print('JS score:', 100*js_score/len(data), '%')