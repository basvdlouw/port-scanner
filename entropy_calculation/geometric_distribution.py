import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import geom

# Define Parameters
num_ports = 10000  # Total number of ports to scan
average_open_ports = 10  # Average number of open ports per scan
success_prob = average_open_ports / num_ports  # Probability of finding an open port

# Simulate which ports are open using Geometric distribution
unnormalized_probabilities = [geom.pmf(i, success_prob) for i in range(1, num_ports + 1)]
geometric_distribution_normalized_probabilities = [p / sum(unnormalized_probabilities) for p in
                                                   unnormalized_probabilities]

entropy = -np.sum(geometric_distribution_normalized_probabilities * np.log2(geometric_distribution_normalized_probabilities))
print("Entropy:", entropy)


# Create a plot of the geometric distribution
x_values = np.arange(1, num_ports + 1)
plt.bar(x_values, geometric_distribution_normalized_probabilities, align='center')
plt.xlabel('Port')
plt.ylabel('Probability')
plt.title('Geometric Distribution (p = ' + str(success_prob) + ")")
plt.savefig("geometric_distribution_1000")
plt.show()

exit()
