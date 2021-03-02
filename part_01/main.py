import random

def initialyze():
    return random.randbytes(1) 


def main():
    parents = initialyze()
    print(parents)


main()