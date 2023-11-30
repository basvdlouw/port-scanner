import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import zipf

# Define Parameters
num_ports = 10000  # Total number of ports to scan
average_open_ports = 5 # Average number of open ports per scan
s = (1 / np.log(num_ports / average_open_ports))
k_values = np.arange(1, num_ports + 1)  # Values for k in the Zipf distribution

# Simulate the Zipf distribution
unnormalized_probabilities = [1 / (k ** s) for k in k_values]
zipf_distribution_normalized_probabilities = [p / sum(unnormalized_probabilities) for p in
                                              unnormalized_probabilities]

entropy = -np.sum(zipf_distribution_normalized_probabilities * np.log2(zipf_distribution_normalized_probabilities))
print("Entropy:", entropy)

# Create a plot of the Zipf distribution
plt.bar(k_values, zipf_distribution_normalized_probabilities, align='center')
plt.xlabel('Port Detected as Open')
plt.ylabel('Probability')
plt.margins(y=0.6)  # Adjust vertical margin
plt.title('Zipf Distribution (s = ' + str(round(s, 2)) + ")")
plt.savefig("zipf_distribution_10000")
plt.show()

exit()
