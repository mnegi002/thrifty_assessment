def longest_palindrome(s: str) -> str:
    if not s:
        return ""

    start, end = 0, 0

    def expand_from_center(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return left + 1, right - 1

    for i in range(len(s)):
        # for edd length palindrome
        l1, r1 = expand_from_center(i, i)
        # for even length palindrome
        l2, r2 = expand_from_center(i, i + 1)

        # Choosing the longer
        if r1 - l1 > end - start:
            start, end = l1, r1
        if r2 - l2 > end - start:
            start, end = l2, r2

    return s[start:end + 1]


# Example :
print(longest_palindrome("babad"))
print(longest_palindrome("cbbd"))
