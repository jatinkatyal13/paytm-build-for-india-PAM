import nltk.classify.util
from nltk.classify import NaiveBayesClassifier
from nltk.corpus import movie_reviews

from collections import OrderedDict
 
def word_feats(words):
    return dict([(word, True) for word in words])
 
negids = movie_reviews.fileids('neg')
posids = movie_reviews.fileids('pos')
 
negfeats = [(word_feats(movie_reviews.words(fileids=[f])), 'neg') for f in negids]
posfeats = [(word_feats(movie_reviews.words(fileids=[f])), 'pos') for f in posids]
 
classifier = NaiveBayesClassifier.train(negfeats + posfeats)

def classify_sentiment(s):
	d = OrderedDict()
	res = classifier.prob_classify(word_feats(s))
	for x in res.samples():
		d[x] = res.prob(x)
	return d