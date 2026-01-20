# Investor Matching Algorithm: Mathematical Specification

## 1. System Definitions

Let $\mathcal{I}$ be the set of all Investors $I$, and $\mathcal{S}$ be the set of input Startups or Founders.

For any Investor $I \in \mathcal{I}$, we define a feature vector $\mathbf{x}_I$ derived from their historical portfolio $\mathcal{P}_I = \{p_1, p_2, \dots, p_N\}$, where each $p_j$ represents a past investment event.

For a query Startup $S \in \mathcal{S}$, we define an attribute vector:
$$
\mathbf{u}_S = [\text{sector}, \text{stage}, \text{growth-rate}]
$$

---

## 2. Feature Engineering & Heuristics

We construct a behavioral profile for each investor using the following derived metrics.

### 2.1. Activity Volatility ($\nu$)
This metric quantifies the irregularity in an investor's timeline and the scale of their portfolio. It is a composite function of portfolio size and temporal dispersion.

$$
\nu(I) = \ln(1 + |\mathcal{P}_I|) + \sigma_{\text{years}}
$$

Where $\sigma_{\text{years}}$ is the standard deviation of the investment years $Y = \{y_1, \dots, y_N\}$:

$$
\sigma_{\text{years}} = \sqrt{\frac{1}{N} \sum_{j=1}^{N} (y_j - \mu_Y)^2}
$$

*   $\mu_Y$: Mean investment year.
*   **Interpretation**: High $\nu$ indicates a large, temporally scattered portfolio.

### 2.2. Growth Dependency (Herfindahl-Hirschman Index)
We utilize the Herfindahl-Hirschman Index (HHI) to measure the concentration of an investor's portfolio on specific companies (i.e., do they double down often or spray and pray?).

Let $C$ be the set of unique companies in $\mathcal{P}_I$. Let $n_k$ be the number of times company $c_k$ appears in the portfolio. The relative frequency share $s_k$ is:

$$
s_k = \frac{n_k}{|\mathcal{P}_I|}
$$

The Growth Dependency $\delta$ is defined as:

$$
\delta(I) = \sum_{k=1}^{|C|} s_k^2
$$

*   **Range**: $\delta \in [0, 1]$.
*   $\delta \to 1$: Maximum concentration (invested in only 1 company).
*   $\delta \to 0$: Maximum diversification.

### 2.3. Safety Score ($\Psi$)
The Safety Score is a non-linear ranking function designed to prioritize stable investors. It utilizes the Percentile Rank function $R_{\%}(X)$, which maps a value $x$ to its cumulative distribution function (CDF) value within the population $\mathcal{I}$.

$$
\Psi(I) = \text{clip}_{[0,1]} \left( 1 - \alpha \cdot R_{\%}(\nu(I)) - \beta \cdot R_{\%}(\delta(I)) + \gamma \cdot R_{\%}(|\mathcal{P}_I|) \right)
$$

**Coefficients used:**
*   $\alpha = 0.4$ (Penalty for high volatility)
*   $\beta = 0.4$ (Penalty for high concentration)
*   $\gamma = 0.2$ (Reward for large portfolio size)

---

## 3. Vector Space & Similarity

### 3.1. Domain Embeddings
We map domain descriptions to a Hilbert Space $\mathcal{H}$ ($\mathbb{R}^{d}$) using a Transformer model $\phi$.

$$
\mathbf{v}_{\text{startup}} = \phi(\text{startup-sector})
$$

$$
\mathbf{v}_{\text{investor}} = \phi(\text{investor-domains})
$$

The semantic similarity is the cosine of the angle $\theta$:

$$
\text{Sim}_{\text{domain}} = \cos(\theta) = \frac{\mathbf{v}_{\text{startup}} \cdot \mathbf{v}_{\text{investor}}}{\|\mathbf{v}_{\text{startup}}\| \|\mathbf{v}_{\text{investor}}\|}
$$

### 3.2. Stage Alignment (Binary Cross-Correlation)
Let $\mathbf{h}_{\text{stage}} \in \{0,1\}^K$ be the one-hot encoded vector of the startup's stage.
Let $\mathbf{M}_{\text{pref}} \in \{0,1\}^{K}$ be the multi-hot encoded vector of the investor's stage preferences.

The Stage Match Score is the scalar projection:

$$
\text{Match}_{\text{stage}} = \mathbf{h}_{\text{stage}} \cdot \mathbf{M}_{\text{pref}}
$$

---

## 4. Predictive Modeling (XGBoost)

We employ a Gradient Boosted Decision Tree (GBDT) classifier to estimate the probability of a successful match.

### 4.1. The Additive Model
The model approximates the log-odds of a match by summing the output of $K$ decision trees $f_k$:

$$
\hat{y}_i = \sum_{k=1}^{K} f_k(\mathbf{x}_i), \quad f_k \in \mathcal{F}
$$

Where $\mathbf{x}_i$ is the concatenated feature vector for the pair $(S, I)$.

### 4.2. Objective Function
The model was trained to minimize the Regularized Logistic Loss:

$$
\mathcal{L}(\phi) = \sum_{i} l(y_i, \hat{y}_i) + \sum_{k} \Omega(f_k)
$$

Where $l$ is the differentiable convex loss function (Binary Cross-Entropy):

$$
l(y_i, \hat{y}_i) = y_i \ln(1 + e^{-\hat{y}_i}) + (1-y_i) \ln(1 + e^{\hat{y}_i})
$$

The final probability output is the sigmoid activation of the raw leaf sum:

$$
P(\text{match} \mid S, I) = \sigma(\hat{y}_i) = \frac{1}{1 + e^{-\hat{y}_i}}
$$

---

## 5. Final Decision Function (The Meta-Score)

The system makes a final recommendation based on a linear combination of the AI probability and the heuristic safety metrics.

$$
\text{Score}_{\text{final}} = w_1 P(\text{match}) + w_2 C + w_3 (1 - R_{\%}(\nu)) + w_4 R_{\%}(\Psi)
$$

**Weight Distribution**:
1.  **AI Probability** ($w_1 = 0.45$): The core predictive signal.
2.  **Confidence** ($w_2 = 0.20$): External confidence metric (e.g., from vision analysis).
3.  **Stability** ($w_3 = 0.15$): Reward for low volatility (inverted rank).
4.  **Safety** ($w_4 = 0.20$): Reward for high safety score.
