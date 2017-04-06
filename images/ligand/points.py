import numpy as np
import math

deg = math.pi/180.0

xyz = []

for theta in np.arange(0.0, 1*math.pi, 20*deg):
    for phi in np.arange(0.0, 2*math.pi, 45*deg):
        xyz.append([10*math.sin(theta)*math.cos(phi),
            10*math.sin(theta)*math.sin(phi),
            10*math.cos(theta)
            ])

print(xyz)
np.savetxt('points.xyz', xyz)
