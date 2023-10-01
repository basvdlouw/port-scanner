from array import array

import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import poisson, geom

# Define Parameters
num_scans = 10  # Number of port scans
num_ports = 60000  # Total number of ports to scan
average_open_ports = 5  # Average number of open ports per scan
success_prob = average_open_ports / num_ports  # Probability of finding an open port in a single scan

# Samples
detected_open_ports_combinations = []

# poisson_probabilities = [poisson.pmf(k, average_open_ports) for k in range(1, num_ports + 1)]
# poisson_distribution_normalized_probabilities = [p / sum(poisson_probabilities) for p in poisson_probabilities]

# Simulate which ports are open using Geometric distribution
unnormalized_probabilities = [geom.pmf(i, success_prob) for i in range(1, num_ports + 1)]
geometric_distribution_normalized_probabilities = [p / sum(unnormalized_probabilities) for p in
                                                   unnormalized_probabilities]

for _ in range(num_scans):
    # Simulate the number of open ports using Poisson distribution
    num_open_ports = poisson.rvs(average_open_ports)

    open_ports = np.random.choice(
        num_ports,
        size=num_open_ports,
        replace=False,
        p=geometric_distribution_normalized_probabilities
    )
    detected_open_ports_combinations.append(open_ports)


# Calculate Shannon's Entropy
def shannon_entropy(open_ports_combination: array):

    # Calculate probability distribution for combination of open ports based on geometric distribution
    port_probabilities = []

    for port in open_ports_combination:
        # Calculate the probability of each port being selected using the Geometric distribution
        port_probability = geometric_distribution_normalized_probabilities[port]
        port_probabilities.append(port_probability)

    # Calculate the entropy based on the array of open ports
    H = -np.sum(port_probabilities * np.log2(port_probabilities))

    return H


entropies = [shannon_entropy(open_ports) for open_ports in detected_open_ports_combinations]

# Plot Histogram of Entropy
plt.hist(entropies, bins=20, alpha=0.75, edgecolor='k')
plt.xlabel('Shannon Entropy')
plt.ylabel('Frequency')
plt.title('Distribution of Shannon Entropy')
plt.grid(True)
plt.show()

exit()

# Plot Poisson Distribution
# x = np.arange(0, 15)
# pmf = poisson.pmf(x, average_open_ports)
# plt.bar(x, pmf, align='center', alpha=0.75, edgecolor='k')
# plt.xlabel('Number of Open Ports')
# plt.ylabel('Probability')
# plt.title('Poisson Distribution for Number of Open Ports')
# plt.grid(True)
# plt.show()

# # Plot Geometric Distribution
# x = np.arange(1, num_ports + 1)
# pmf = geom.pmf(x, success_prob)
# normalized_pmf = [p / sum(pmf) for p in pmf]
# plt.bar(x, normalized_pmf, align='center', alpha=0.75, edgecolor='k')
# plt.xlabel('Port Number')
# plt.ylabel('Probability')
# plt.title('Geometric Distribution for Port Selection')
# plt.grid(True)
# plt.show()
