import pandas as pd
import re
from pyvi import ViTokenizer
import sys

from functools import wraps
import time

# def timeit(func):
#     @wraps(func)
#     def timeit_wrapper(*args, **kwargs):
#         start_time = time.perf_counter()
#         result = func(*args, **kwargs)
#         end_time = time.perf_counter()
#         total_time = end_time - start_time
#         print(f'Function {func.__name__}{args} {kwargs} Took {total_time:.4f} seconds')
#         return result
#     return timeit_wrapper


class CompareTwoText:
    def __init__(self):
        self.s1 = u'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹ'
        self.s0 = u'AAAAEEEIIOOOOUUYaaaaeeeiioooouuyAaDdIiUuOoUuAaAaAaAaAaAaAaAaAaAaAaAaEeEeEeEeEeEeEeEeIiIiOoOoOoOoOoOoOoOoOoOoOoOoUuUuUuUuUuUuUuYyYyYyYy'
    
    def _convertToLower(self, text):
        return text.lower() if type(text) == str else str(text).lower()

    def _removePunctuation(self, text):
        text = re.sub(r'[^\w\s]', '', text)
        text = text.replace('_', ' ')
        text = text.replace('  ', ' ')
        return text
    
    def _removeAccents(self, text):
        s = ''
        for c in text:
            if c in self.s1:
                s += self.s0[self.s1.index(c)]
            else:
                s += c
        return s

    def _stemming(self, text):
        text = re.split(r'(\d+)', text)
        text = ' '.join(text)
        return ViTokenizer.tokenize(text)

    def _preprocess(self, text):
        text = self._convertToLower(text)
        text = self._stemming(text)
        text = self._removePunctuation(text)
        text = self._removeAccents(text)
        return text

    def _similarityCalculation(self, text1, text2):
        def dice_similarity(s1, s2):
            s1, s2 = set(s1), set(s2)
            return 2 * len(s1.intersection(s2)) / (len(s1) + len(s2))

        def getNgram(text, n):
            ngram = []
            for i in range(len(text) - n + 1):
                ngram.append(text[i:i+n])
            return ngram
        text1, text2 = self._preprocess(text1), self._preprocess(text2)
        text1, text2 = getNgram(text1, 3), getNgram(text2, 3)
        return dice_similarity(text1, text2)

    def compareTwoText(self, text1, text2):
        return self._similarityCalculation(text1, text2)


# @timeit
def evaluate_similarity(datapath):
    cmp = CompareTwoText()
    dataset = pd.read_csv(datapath)
    start_time = time.time()
    dataset['Python code Similarity'] = dataset.apply(lambda x: cmp.compareTwoText(x['ltable_item_name'], x['rtable_item_name']), axis=1)
    end_time = time.time()
    total_time = end_time - start_time
    print(f'Function evaluate_similarity Took {total_time:.4f} seconds')
    dataset.to_csv('output.csv', index=False)

evaluate_similarity(sys.argv[1])