import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

use_device = 'cuda' if torch.cuda.is_available() else 'cpu'

# Load the default summarization pipeline (uses BART under the hood)
model_name = "facebook/bart-large-cnn"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(use_device)

text = """
Hugging Face's transformers library provides APIs and tools to easily download 
and train state-of-the-art pretrained models. Using deep learning architectures 
like transformers, developers can perform tasks such as named entity recognition, 
translation, text generation, and summarization with just a few lines of code. 
The high-level pipeline abstraction handles all preprocessing and postprocessing 
automatically.
"""

# Generate summary
inputs = tokenizer(text, return_tensors="pt", max_length=1024, truncation=True).to(use_device)
summary_ids = model.generate(**inputs, max_new_tokens=50, min_length=50, do_sample=False)
summary_text = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

print(summary_text)