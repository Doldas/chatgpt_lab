"""Run: python3 -m unittest discover -s framtidsposten -p 'test_*.py'"""
import contextlib
import io
import unittest

from stamps import HEIGHT, WIDTH, generate, main, render


class StampTests(unittest.TestCase):
    def test_same_seed_same_result(self):
        self.assertEqual(generate("tisdag"), generate("tisdag"))

    def test_different_seeds_change_output(self):
        self.assertNotEqual(generate("tisdag"), generate("onsdag"))

    def test_grid_dimensions(self):
        for seed in ("a", "☕", "abcdefghijkl"):
            stamp = generate(seed)
            self.assertEqual(len(stamp["sky"]), HEIGHT)
            self.assertTrue(all(len(line) == WIDTH for line in stamp["sky"]))

    def test_render_includes_metadata(self):
        stamp = generate("hej")
        output = render(stamp)
        self.assertIn(stamp["message"], output)
        self.assertIn(stamp["place"].upper(), output)
        self.assertIn("FRAMTIDSPOSTEN", output)

    def test_seed_constraints(self):
        with self.assertRaises(ValueError):
            generate("  ")
        with self.assertRaises(ValueError):
            generate("a" * 201)

    def test_cli_prints_requested_amount(self):
        stream = io.StringIO()
        with contextlib.redirect_stdout(stream):
            self.assertEqual(main(["rum", "--antal", "3"]), 0)
        self.assertEqual(stream.getvalue().count("FRAMTIDSPOSTEN"), 3)

    def test_cli_rejects_unbounded_requests(self):
        with contextlib.redirect_stderr(io.StringIO()):
            with self.assertRaises(SystemExit) as err:
                main(["hej", "--antal", "21"])
        self.assertEqual(err.exception.code, 2)


if __name__ == "__main__":
    unittest.main()
