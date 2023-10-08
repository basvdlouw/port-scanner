import numpy as np
from matplotlib import pyplot as plt

# Define Parameters
num_ports = 10000  # Total number of ports to scan

# Simulate a uniform distribution
uniform_distribution_probabilities = [1 / num_ports] * num_ports

entropy = -np.sum(uniform_distribution_probabilities * np.log2(uniform_distribution_probabilities))
print("Entropy:", entropy)

# Create a plot of the uniform distribution
x_values = np.arange(1, num_ports + 1)
plt.bar(x_values, uniform_distribution_probabilities, align='center')
plt.xlabel('Port Detected as Open')
plt.ylabel('Probability')
plt.title('Uniform Distribution')
plt.savefig("uniform_distribution_1000")
plt.show()

exit()
