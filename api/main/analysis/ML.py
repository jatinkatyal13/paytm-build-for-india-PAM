import pickle
import nltk
from nltk.stem import *
import pandas as pd
from collections import OrderedDict

clf = pickle.load(open('/Users/jatinkatyal/Desktop/jatin/PAM/api/main/analysis/model.pickle', 'rb'))

Data = pd.read_csv('/Users/jatinkatyal/Desktop/jatin/PAM/api/main/analysis/ISEAR.csv',header=None)
def get_words_in_dataset(dataset):
	all_words = []
	for (words, sentiment) in dataset:
		all_words.extend(words)
	return all_words

def get_word_features(wordlist):
	wordlist = nltk.FreqDist(wordlist)
	word_features = wordlist.keys()
	return word_features

def removal(sentences):
    sentence_list = []
    count = 0
#     for sen in sentences:
#         count += 1
#         print count
#         print sen
#         print type(sen)
    s = nltk.word_tokenize(sentences)
    characters = ["á", "\xc3", "\xa1", "\n", ",", ".", "[", "]", ""]
    l = []
    for t in s:
        if t not in characters:
            l.append(t)
    return l

def pos_tag(sentences):
    tags = [] #have the pos tag included
    nava_sen = []
    pt = nltk.pos_tag(sentences)
#     for s in sentences:
#     s_token = nltk.word_tokenize(sentences)
#     pt = nltk.pos_tag(s_token)
    nava = []
    nava_words = []
    for t in pt:
        if t[1].startswith('NN') or t[1].startswith('JJ') or t[1].startswith('VB') or t[1].startswith('RB'):
            nava.append(t)
            nava_words.append(t[0])
    return nava, nava_words

def stemming(sentences):
    sentence_list = []
    sen_string = []
    sen_token = []
    stemmer = PorterStemmer()
    i = 0
#     for sen in sentences:
#         print i,
    i += 1
    st = ""
    for word in sentences:
        word_l = word.lower()
        if len(word_l) >= 3:
            st += stemmer.stem(word_l) + " "
    sen_string.append(st)
    w_set = nltk.word_tokenize(st)
    sen_token.append(w_set)
    w_text = nltk.Text(w_set)
    sentence_list.append(w_text)
    return w_text, st, w_set

def create_frame(Data):
    labels = []
#     sentences = []
#     sen_string = []
#     sen_token =[]
    sen = []
    sen_s = []
    sen_t = []
    labelset = []
    for i in range(len(Data)):
        if i >= 0:
#             print i,
            emotion = Data[0][i]
            sit = Data[1][i]
#             if emotion not in ['shame', 'guilt']:
            labels.append(emotion)
            labelset.append([emotion])
            sent = removal(sit)
            nava, sent_pt = pos_tag(sent)
            sentences, sen_string, sen_token = stemming(sent_pt)
            sen.append(sentences)
            sen_s.append(sen_string)
            sen_t.append(sen_token)
#     labels, labelset, exclude = class_labels(emotions[1:])
#     sent = removal(sit[1:], exclude)
#     nava, sent_pt = pos_tag(sent)
#     sentences, sen_string, sen_token = stemming(sent_pt)
    frame = pd.DataFrame({0 : labels,
                          1 : sen,
                          2 : sen_s,
                          3 : sen_t,
                          4 : labelset})
    return frame, sen_t, labels, sen_s

def create_data(sentence, emotion):
    data = []
    for i in range(len(sentence)):
        sen = []
        for s in sentence[i]:
            sen.append(str(s))
        emo = emotion[i]
        data.append((sen, emo))
    return data

def extract_features(document, word_features):
	document_words = set(document)
	features = {}
	for word in word_features:
		features['contains(%s)' % word] = (word in document_words)
	return features

def classify_dataset(data, word_features):
    d = OrderedDict()
    c = clf.prob_classify(extract_features(nltk.word_tokenize(data), word_features))
    for x in c.samples():
        d[x] = c.prob(x)
    return d

if __name__ == "__main__":
	
	print(type(Data))
	c, st, labels, senten = create_frame(Data)
	sen = c[3]
	emo = c[0]
	Data = create_data(sen, emo)

	word_features = get_word_features(get_words_in_dataset(Data))
	
	while True:
		print("Enter line to analyze")
		s = input()
		print(classify_dataset(s, word_features))
