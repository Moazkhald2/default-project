# Math Visualization

Skill for describing math visualizations and generating plotting code (primarily Python/matplotlib).

## When to Use

- User needs a graph or plot of a math function
- User wants to visualize a geometric concept
- User needs statistical charts
- User wants an animation of a dynamic math concept
- User needs to include visualizations in lesson materials

## Visualization Categories

### 2D Function Plots
- Lines, parabolas, polynomials
- Trig functions (sin, cos, tan)
- Exponentials, logarithms
- Piecewise functions
- Implicit curves
- Parametric curves

### 3D Surfaces
- Planes, quadrics (sphere, paraboloid, hyperboloid)
- Parametric surfaces
- Contour plots
- Vector fields

### Statistical Charts
- Histograms, box plots
- Scatter plots, line graphs
- Bar charts, pie charts
- Normal distribution curves
- Probability density functions

### Geometric Figures
- Triangles, circles, polygons
- Transformations (translation, rotation, reflection)
- Coordinate planes with shapes
- Congruence and similarity visualizations

## Matplotlib Quick Reference

### Basic Setup
```python
import matplotlib.pyplot as plt
import numpy as np

# For Jupyter notebooks
%matplotlib inline

# Create figure
fig, ax = plt.subplots(figsize=(8, 6))
```

### Plot Types

**Line plot**
```python
x = np.linspace(-2, 2, 100)
y = x**2
ax.plot(x, y, 'b-', linewidth=2, label='$f(x)=x^2$')
```

**Scatter plot**
```python
x = np.random.randn(50)
y = np.random.randn(50)
ax.scatter(x, y, c='red', alpha=0.6, s=30)
```

**Bar chart**
```python
categories = ['A', 'B', 'C']
values = [10, 24, 17]
ax.bar(categories, values, color='steelblue')
```

**Histogram**
```python
data = np.random.randn(1000)
ax.hist(data, bins=20, edgecolor='black', alpha=0.7)
```

### Formatting

```python
# Labels and title
ax.set_xlabel('X-axis label', fontsize=12)
ax.set_ylabel('Y-axis label', fontsize=12)
ax.set_title('Plot Title', fontsize=14, fontweight='bold')

# Grid and legend
ax.grid(True, alpha=0.3)
ax.legend(loc='upper right')

# Axis limits and aspect
ax.set_xlim(-3, 3)
ax.set_ylim(-1, 10)
ax.set_aspect('equal')  # important for geometry

# Ticks
ax.set_xticks([-2, -1, 0, 1, 2])
ax.set_xticklabels(['-2', '-1', '0', '1', '2'])

# Add annotation
ax.annotate('Vertex', xy=(0, 0), xytext=(1, 2),
            arrowprops=dict(arrowstyle='->'))
```

### Color Schemes

| Purpose | Colormap | Code |
|---------|----------|------|
| Sequential | Blues, Greens | `plt.cm.Blues` |
| Diverging | RdYlBu, coolwarm | `plt.cm.coolwarm` |
| Qualitative | Set1, Set2, Pastel1 | `plt.cm.Set1` |
| Cyclic | hsv, twilight | `plt.cm.twilight` |

### Subplots

```python
fig, axes = plt.subplots(2, 2, figsize=(10, 8))
axes[0, 0].plot(x, y1)
axes[0, 1].plot(x, y2)
axes[1, 0].scatter(x, y3)
axes[1, 1].bar(categories, values)
plt.tight_layout()
```

## Common Visualizations by Topic

### Algebra

**Linear function**
```python
x = np.linspace(-5, 5, 100)
m, b = 2, -1
y = m * x + b
ax.plot(x, y, label=f'$y = {m}x + {b}$')
ax.axhline(0, color='gray', linewidth=0.5)
ax.axvline(0, color='gray', linewidth=0.5)
```

**Quadratic function**
```python
x = np.linspace(-4, 4, 100)
y = x**2 - 3*x + 2
ax.plot(x, y, label='$f(x)=x^2 - 3x + 2$')
# Mark roots
roots = np.roots([1, -3, 2])
ax.scatter(roots, [0, 0], color='red', zorder=5, label='Roots')
```

### Geometry

**Triangle**
```python
triangle = np.array([[0, 0], [4, 0], [2, 3], [0, 0]])
ax.plot(triangle[:, 0], triangle[:, 1], 'b-')
ax.fill(triangle[:, 0], triangle[:, 1], alpha=0.3)
```

**Circle**
```python
theta = np.linspace(0, 2*np.pi, 100)
r = 2
x = r * np.cos(theta)
y = r * np.sin(theta)
ax.plot(x, y, 'b-')
ax.set_aspect('equal')
```

### Calculus

**Tangent line**
```python
x = np.linspace(-2, 2, 100)
def f(x): return x**2
def f_prime(x): return 2*x

a = 1
tangent = f(a) + f_prime(a) * (x - a)
ax.plot(x, f(x), label='$f(x)=x^2$')
ax.plot(x, tangent, '--', label=f'Tangent at x={a}')
ax.scatter([a], [f(a)], color='red', zorder=5)
```

**Riemann sums**
```python
x = np.linspace(0, 2*np.pi, 50)
y = np.sin(x)
ax.bar(x, y, width=2*np.pi/50, alpha=0.3, align='edge', label='Riemann sum')
ax.plot(x, y, 'r-', linewidth=2, label='$\\sin(x)$')
```

**Area between curves**
```python
x = np.linspace(0, 2, 100)
y1 = x**2
y2 = x
ax.fill_between(x, y1, y2, where=(y2 >= y1), alpha=0.3, color='green')
ax.plot(x, y1, label='$y = x^2$')
ax.plot(x, y2, label='$y = x$')
```

### Statistics

**Normal distribution**
```python
mu, sigma = 0, 1
x = np.linspace(-4, 4, 100)
y = (1/(sigma*np.sqrt(2*np.pi))) * np.exp(-0.5*((x-mu)/sigma)**2)
ax.plot(x, y, label=f'$\\mathcal{{N}}({mu},{sigma})$')
```

**Box plot**
```python
data = [np.random.randn(50) for _ in range(3)]
ax.boxplot(data, labels=['Group A', 'Group B', 'Group C'])
```

## 3D Plots

```python
from mpl_toolkits.mplot3d import Axes3D
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Surface plot
X, Y = np.meshgrid(np.linspace(-3, 3, 30), np.linspace(-3, 3, 30))
Z = np.sin(np.sqrt(X**2 + Y**2))
surf = ax.plot_surface(X, Y, Z, cmap='coolwarm', alpha=0.8)
fig.colorbar(surf)
```

## Animations

```python
import matplotlib.animation as animation
from IPython.display import HTML

fig, ax = plt.subplots()
x = np.linspace(0, 2*np.pi, 100)
line, = ax.plot(x, np.sin(x))

def animate(frame):
    line.set_ydata(np.sin(x + frame/10))
    return line,

ani = animation.FuncAnimation(fig, animate, frames=100, interval=50)
HTML(ani.to_jshtml())  # In Jupyter
```

## Interactive with Plotly

```python
import plotly.express as px
import plotly.graph_objects as go

# Interactive line plot
fig = go.Figure()
fig.add_trace(go.Scatter(x=x, y=y, mode='lines', name='sin(x)'))
fig.update_layout(title='Interactive Plot', xaxis_title='x', yaxis_title='y')
fig.show()
```

## Desmos Integration

For web-based visualizations, provide Desmos links or instructions:
```
Desmos graph: graphs of y = ax^2 + bx + c with sliders for a, b, c
Setup: https://www.desmos.com/calculator
Instructions: Create sliders for parameters, show how graph changes
```

## Export Formats

```python
plt.savefig('plot.png', dpi=300, bbox_inches='tight')        # PNG
plt.savefig('plot.pdf', bbox_inches='tight')                  # PDF
plt.savefig('plot.svg', format='svg', bbox_inches='tight')    # SVG
```

## Output

When generating a visualization, return:
1. Complete Python code with matplotlib (or plotly if interactive requested)
2. Explanation of what the code does
3. Key visual elements (labels, colors, annotations)
4. Suggested export format
5. Alternative tools if relevant (Desmos, GeoGebra)
