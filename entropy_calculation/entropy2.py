from array import array

import numpy as np
from scipy.stats import poisson, geom, entropy

# Define Parameters
num_scans = 10  # Number of port scans
num_ports = 1000  # Total number of ports to scan
average_open_ports = 5  # Average number of open ports per scan
success_prob = average_open_ports / num_ports  # Probability of finding an open port in a single scan

# Simulate the number of open ports using Poisson distribution
num_open_ports = poisson.rvs(average_open_ports)

poisson_probabilities = [poisson.pmf(k, average_open_ports) for k in range(1, num_ports + 1)]
poisson_distribution_normalized_probabilities = [p / sum(poisson_probabilities) for p in poisson_probabilities]

# Simulate which ports are open using Geometric distribution
unnormalized_probabilities = [geom.pmf(i, success_prob) for i in range(1, num_ports + 1)]
geometric_distribution_normalized_probabilities = [p / sum(unnormalized_probabilities) for p in unnormalized_probabilities]
open_ports = np.random.choice(
    num_ports,
    size=num_open_ports,
    replace=False,
    p=geometric_distribution_normalized_probabilities
)



# Calculate Shannon's Entropy
def shannon_entropy():
    # Calculate the combined probability
    H = -np.sum(geometric_distribution_normalized_probabilities * np.log2(geometric_distribution_normalized_probabilities))

    return H

print(shannon_entropy())